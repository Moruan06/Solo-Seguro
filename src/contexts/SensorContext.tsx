import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { subscribeLeituras, LeituraEvent } from "@/lib/sse";
import { useAuth } from "./AuthContext";

// Mantém as chaves usadas pelas telas existentes: temperature / percent / gas
export interface SensorSnapshot {
  temperature: number | null;
  percent: number | null;
  gas: number | null;
}

export interface HistoryPoint {
  time: string;
  temperature: number;
  percent: number;
  gas: number;
}

export type SensorIdMap = {
  temperature?: string;
  percent?: string;
  gas?: string;
};

interface SensorContextValue {
  latest: SensorSnapshot;
  history: HistoryPoint[];
  sensorIds: SensorIdMap;
  connected: boolean;
  lastEventAt: Date | null;
}

const SensorContext = createContext<SensorContextValue | undefined>(undefined);

// Mapeia o "tipo" da leitura (vindo do backend) para a chave da tela
function tipoToKey(tipo: string): keyof SensorSnapshot | null {
  const t = (tipo ?? "").toLowerCase();
  if (t.includes("temperatura")) return "temperature";
  if (t.includes("umidade")) return "percent";
  if (t.includes("gás") || t.includes("gas")) return "gas";
  return null;
}

// IDs iniciais (sensores demo) vindos do .env — permitem carregar o histórico
// já na abertura. São complementados/atualizados pelos eventos do SSE.
const SENSOR_IDS_INICIAIS: SensorIdMap = {
  temperature: import.meta.env.VITE_SENSOR_TEMP as string | undefined,
  percent: import.meta.env.VITE_SENSOR_UMID as string | undefined,
  gas: import.meta.env.VITE_SENSOR_GAS as string | undefined,
};

export function SensorProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [latest, setLatest] = useState<SensorSnapshot>({ temperature: null, percent: null, gas: null });
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [sensorIds, setSensorIds] = useState<SensorIdMap>(SENSOR_IDS_INICIAIS);
  const [connected, setConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<Date | null>(null);
  const latestRef = useRef<SensorSnapshot>(latest);
  latestRef.current = latest;

  useEffect(() => {
    if (!token) return;

    const stop = subscribeLeituras(
      token,
      (e: LeituraEvent) => {
        const key = tipoToKey(e.tipo);
        setLastEventAt(new Date());
        if (!key) return;

        // Descobre/atualiza o sensorId daquele tipo (para buscar histórico via REST)
        if (e.sensorId) {
          setSensorIds((prev) => (prev[key] === e.sensorId ? prev : { ...prev, [key]: e.sensorId }));
        }

        const next: SensorSnapshot = { ...latestRef.current, [key]: e.valor };
        latestRef.current = next;
        setLatest(next);

        const time = new Date(e.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setHistory((prev) => [
          ...prev.slice(-49),
          {
            time,
            temperature: next.temperature ?? 0,
            percent: next.percent ?? 0,
            gas: next.gas ?? 0,
          },
        ]);
      },
      setConnected,
    );

    return stop;
  }, [token]);

  return (
    <SensorContext.Provider value={{ latest, history, sensorIds, connected, lastEventAt }}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensors(): SensorContextValue {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error("useSensors deve ser usado dentro de <SensorProvider>");
  return ctx;
}
