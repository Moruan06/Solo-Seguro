// Assinatura SSE com header Authorization.
// O EventSource nativo do navegador NÃO envia headers, então fazemos o
// streaming via fetch + ReadableStream, parseando os frames "event/data".

import { API_URL, SESSION_EXPIRED_EVENT } from "./api";

export interface LeituraEvent {
  sensorId: string;
  valor: number;
  tipo: string;       // ex.: "Temperatura", "Umidade do Solo", "Gás"
  unidade: string;    // ex.: "°C", "%", "ppm"
  timestamp: string;  // ISO-8601
  anomalia?: boolean;
  dispositivoId?: string;
  apelido?: string;   // apelido do dispositivo
}

/**
 * Conecta no stream /api/v1/sse/leitura e chama onEvent a cada leitura.
 * Reconecta sozinho em caso de queda. Retorna uma função para encerrar.
 */
export function subscribeLeituras(
  token: string,
  onEvent: (e: LeituraEvent) => void,
  onStatus?: (connected: boolean) => void,
): () => void {
  const controller = new AbortController();
  let stopped = false;

  async function connect() {
    while (!stopped) {
      try {
        const res = await fetch(`${API_URL}/api/v1/sse/leitura`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "text/event-stream" },
          signal: controller.signal,
        });
        if (res.status === 401) {
          stopped = true;
          window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
          break;
        }
        if (!res.ok || !res.body) throw new Error(`SSE HTTP ${res.status}`);

        onStatus?.(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!stopped) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Frames SSE são separados por linha em branco
          let sep: number;
          while ((sep = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);
            const data = frame
              .split("\n")
              .filter((l) => l.startsWith("data:"))
              .map((l) => l.slice(5).trim())
              .join("\n");
            if (data) {
              try {
                onEvent(JSON.parse(data) as LeituraEvent);
              } catch {
                /* ignora frames não-JSON (heartbeats etc.) */
              }
            }
          }
        }
      } catch {
        if (stopped) break;
      }
      onStatus?.(false);
      // backoff antes de reconectar
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  connect();
  return () => {
    stopped = true;
    controller.abort();
    onStatus?.(false);
  };
}
