// src/pages/Map.tsx
// Visão de status do talhão. Hoje há uma única placa de sensores e não há
// coordenadas reais — então não fingimos um mapa geográfico: representamos a
// zona monitorada e seu estado, derivado SEMPRE do pior sensor (nunca da
// média, que poderia mascarar um perigo isolado).

import { useSensors } from "@/contexts/SensorContext";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Thermometer,
  Droplet,
  Wind,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

type Status = "good" | "warning" | "danger";

// Mesma régua de avaliação usada no Dashboard, para coerência entre telas.
interface SensorRead {
  key: "temperature" | "percent" | "gas";
  label: string;
  icon: LucideIcon;
  format: (v: number) => string;
  evaluate: (v: number) => Status;
}

const SENSORS: SensorRead[] = [
  {
    key: "temperature",
    label: "Temperatura",
    icon: Thermometer,
    format: (v) => `${v.toFixed(1)}°C`,
    evaluate: (v) => (v > 30 ? "danger" : v < 15 ? "warning" : "good"),
  },
  {
    key: "percent",
    label: "Umidade",
    icon: Droplet,
    format: (v) => `${v.toFixed(0)}%`,
    evaluate: (v) => (v < 30 ? "danger" : v > 70 ? "good" : "warning"),
  },
  {
    // MQ-135: valor BAIXO = gás detectado (perigo).
    key: "gas",
    label: "Gás",
    icon: Wind,
    format: (v) => `${v}`,
    evaluate: (v) => (v >= 2500 ? "good" : v >= 1500 ? "warning" : "danger"),
  },
];

const STATUS_META: Record<
  Status,
  { titulo: string; chip: string; dot: string; text: string; ring: string; field: string; icon: LucideIcon }
> = {
  good: {
    titulo: "Tudo certo no talhão",
    chip: "bg-success",
    dot: "bg-success",
    text: "text-success",
    ring: "ring-success/40",
    field: "from-green-300 to-green-500",
    icon: CheckCircle,
  },
  warning: {
    titulo: "Requer atenção",
    chip: "bg-warning",
    dot: "bg-warning",
    text: "text-warning",
    ring: "ring-warning/50",
    field: "from-amber-200 to-green-400",
    icon: AlertTriangle,
  },
  danger: {
    titulo: "Perigo detectado",
    chip: "bg-danger",
    dot: "bg-danger",
    text: "text-danger",
    ring: "ring-danger/60",
    field: "from-red-300 to-amber-300",
    icon: AlertCircle,
  },
};

const SEVERIDADE: Record<Status, number> = { good: 0, warning: 1, danger: 2 };

const Map = () => {
  const { latest, lastEventAt } = useSensors();
  const semDados = lastEventAt === null;

  // Avalia cada sensor e deriva o status geral pelo PIOR deles.
  const leituras = SENSORS.map((s) => {
    const valor = latest[s.key] ?? 0;
    return { ...s, valor, status: s.evaluate(valor), formatted: s.format(valor) };
  });
  const statusGeral: Status = leituras.reduce<Status>(
    (pior, l) => (SEVERIDADE[l.status] > SEVERIDADE[pior] ? l.status : pior),
    "good",
  );
  const meta = STATUS_META[statusGeral];
  const StatusIcon = meta.icon;
  const emPerigo = leituras.filter((l) => l.status === "danger");

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />

      <main className="container mx-auto px-4 pt-20 pb-8 max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-1">Solo Seguro</h1>
          <h2 className="text-xl text-earth-gradient font-semibold">Talhão · Trigo</h2>
        </div>

        {/* Banner de status geral — só pulsa quando há perigo. */}
        <div
          className={`mb-6 flex items-center gap-4 rounded-xl border p-5 ${meta.text} ${
            statusGeral === "danger" ? "border-danger bg-danger/5 animate-pulse" : "border-border bg-card"
          }`}
        >
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${meta.chip} text-white`}>
            <StatusIcon className="h-7 w-7" />
          </div>
          <div>
            <div className={`text-xl font-bold ${meta.text}`}>
              {semDados ? "Aguardando leituras…" : meta.titulo}
            </div>
            <p className="text-sm text-muted-foreground">
              {semDados
                ? "Nenhuma leitura recebida ainda."
                : `Status geral pelo pior sensor · atualizado às ${lastEventAt!.toLocaleTimeString()}`}
            </p>
          </div>
        </div>

        {/* Ilustração honesta da zona: representa o talhão, colorido pelo status. */}
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div
              className={`relative h-64 w-full bg-gradient-to-br ${meta.field} flex items-center justify-center transition-colors duration-500`}
            >
              {/* Textura de campo (decorativa, não representa coordenadas). */}
              <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
                <defs>
                  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* A zona inteira é a entidade monitorada (uma placa). */}
              <div
                className={`relative z-10 flex flex-col items-center gap-2 rounded-2xl bg-card/90 px-8 py-6 shadow-lg ring-4 ${meta.ring} ${
                  statusGeral === "danger" ? "animate-pulse" : ""
                }`}
              >
                <span className={`flex items-center gap-2 font-semibold ${meta.text}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  Placa 1
                </span>
                <div className="flex gap-4">
                  {leituras.map((l) => {
                    const Icon = l.icon;
                    return (
                      <div key={l.key} className="flex flex-col items-center">
                        <Icon className={`h-5 w-5 ${STATUS_META[l.status].text}`} />
                        <span className="mt-1 text-sm font-bold text-foreground">
                          {semDados ? "—" : l.formatted}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{l.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerta condicional — aparece SOMENTE quando há sensor em perigo. */}
        {emPerigo.length > 0 && (
          <Alert className="mb-6 border-danger bg-danger/5">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <AlertDescription className="text-danger font-medium">
              <strong>ATENÇÃO</strong>
              <br />
              {emPerigo.map((l) => `${l.label}: ${l.formatted}`).join(" · ")} — verificação imediata recomendada.
            </AlertDescription>
          </Alert>
        )}

        {/* Legenda — cores idênticas às usadas no banner e na zona. */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-center font-semibold">Legenda</h3>
            <div className="flex justify-center gap-6">
              <LegendaItem cor="bg-danger" rotulo="Alto risco" />
              <LegendaItem cor="bg-warning" rotulo="Médio risco" />
              <LegendaItem cor="bg-success" rotulo="Baixo risco" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

function LegendaItem({ cor, rotulo }: { cor: string; rotulo: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${cor}`} />
      <span className="text-sm">{rotulo}</span>
    </div>
  );
}

export default Map;
