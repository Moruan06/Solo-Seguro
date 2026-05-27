// Cliente HTTP do backend Solo Seguro (dashboard).
// Autenticação JWT: token guardado no localStorage e enviado como Bearer.

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8080";

const TOKEN_KEY = "ss_token";
const USER_KEY = "ss_user";

export interface AuthUser {
  usuarioId?: string;
  nome?: string;
  email?: string;
  cargo?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

function setSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

interface ApiEnvelope<T> {
  sucesso: boolean;
  mensagem?: string;
  dados?: T;
}

interface LoginData {
  accessToken: string;
  refreshToken: string;
  usuarioId: string;
  email: string;
  nome: string;
  cargo: string;
}

export async function login(email: string, senha: string): Promise<LoginData> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<LoginData> | null;
  if (!res.ok || !json?.sucesso || !json.dados) {
    throw new Error(json?.mensagem ?? `Falha no login (HTTP ${res.status})`);
  }
  const d = json.dados;
  setSession(d.accessToken, { usuarioId: d.usuarioId, nome: d.nome, email: d.email, cargo: d.cargo });
  return d;
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      /* logout best-effort */
    }
  }
  clearSession();
}

// Fetch autenticado para chamadas REST futuras (histórico, gráficos agregados, etc.)
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

// ===== Leituras: histórico bruto e agregado (para gráficos) =====

export interface PontoHistorico {
  time: string;
  valor: number;
}

export interface Agregado {
  media: number;
  minimo: number;
  maximo: number;
  total: number;
}

/** Histórico bruto de um sensor no período (retorna em ordem cronológica). */
export async function getHistoricoSensor(
  sensorId: string,
  inicioIso: string,
  fimIso: string,
  size = 500,
): Promise<PontoHistorico[]> {
  const qs = new URLSearchParams({
    inicio: inicioIso,
    fim: fimIso,
    size: String(size),
    sort: "id.tempo,desc",
  });
  const res = await authedFetch(`/api/v1/leituras/sensor/${sensorId}?${qs.toString()}`);
  if (!res.ok) throw new Error(`Histórico HTTP ${res.status}`);
  const json = await res.json();
  const content: Array<{ valor: number; tempo: string }> = json?.dados?.content ?? [];
  return content
    .map((r) => ({ tempo: r.tempo, valor: Number(r.valor) }))
    .reverse() // veio em ordem decrescente -> deixa crescente para o gráfico
    .map((r) => ({
      time: new Date(r.tempo).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      valor: r.valor,
    }));
}

/** Agregado (média / mínimo / máximo / total) de um sensor no período. */
export async function getAgregado(
  sensorId: string,
  inicioIso: string,
  fimIso: string,
): Promise<Agregado | null> {
  const qs = new URLSearchParams({ inicio: inicioIso, fim: fimIso });
  const res = await authedFetch(`/api/v1/leituras/sensor/${sensorId}/grafico?${qs.toString()}`);
  if (!res.ok) return null;
  const json = await res.json();
  const d = json?.dados;
  return d
    ? { media: Number(d.media), minimo: Number(d.minimo), maximo: Number(d.maximo), total: Number(d.total) }
    : null;
}
