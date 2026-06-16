// src/pages/Dashboard.tsx

import { useEffect, useState, type ReactNode } from "react";
import { useSensors, type SensorSnapshot, type HistoryPoint } from "@/contexts/SensorContext";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { Thermometer, Droplet, Wind, FlaskConical, AlertTriangle, CheckCircle, AlertCircle, Clock } from "lucide-react";

type Status = "good" | "warning" | "danger";

// Quanto tempo sem novas leituras até considerar o dado defasado.
const STALE_MS = 20_000;

// ---------------------------------------------------------------------------
// Configuração dirigida por dados: cada sensor sabe como se formatar e como
// avaliar seu próprio estado. Todos os limites ficam centralizados aqui.
// ---------------------------------------------------------------------------
interface SensorConfig {
  key: keyof SensorSnapshot;
  title: string;
  icon: ReactNode;
  format: (v: number) => string;
  evaluate: (v: number) => { status: Status; label: string };
}

const SENSOR_CONFIGS: SensorConfig[] = [
  {
    key: "temperature",
    title: "Temperatura",
    icon: <Thermometer className="w-6 h-6" />,
    format: (v) => `${v.toFixed(1)}°C`,
    evaluate: (v) =>
      v > 30
        ? { status: "danger", label: "Alta" }
        : v < 15
        ? { status: "warning", label: "Baixa" }
        : { status: "good", label: "Estável" },
  },
  {
    key: "percent",
    title: "Umidade",
    icon: <Droplet className="w-6 h-6" />,
    format: (v) => `${v.toFixed(0)}%`,
    evaluate: (v) =>
      v > 70
        ? { status: "good", label: "Úmido" }
        : v < 30
        ? { status: "danger", label: "Seco" }
        : { status: "warning", label: "Moderado" },
  },
  {
    // MQ-135: valor ALTO = ar limpo (resistência alta), valor BAIXO = gás detectado
    key: "gas",
    title: "Nível de Gás",
    icon: <Wind className="w-6 h-6" />,
    format: (v) => `${v}`,
    evaluate: (v) =>
      v >= 2500
        ? { status: "good", label: "Normal" }
        : v >= 1500
        ? { status: "warning", label: "Moderado" }
        : { status: "danger", label: "Perigo" },
  },
  {
    key: "ph",
    title: "pH do Solo",
    icon: <FlaskConical className="w-6 h-6" />,
    format: (v) => v.toFixed(2),
    evaluate: (v) =>
      v < 5.5
        ? { status: "danger", label: "Ácido" }
        : v < 6.5
        ? { status: "warning", label: "Lev. Ácido" }
        : v <= 7.5
        ? { status: "good", label: "Neutro" }
        : v <= 8.5
        ? { status: "warning", label: "Lev. Alcalino" }
        : { status: "danger", label: "Alcalino" },
  },
];

// Tudo que muda conforme o status num só lugar (cor, ícone, traço do gráfico).
const STATUS_META: Record<Status, { badge: string; text: string; border: string; stroke: string; icon: ReactNode }> = {
  good: {
    badge: "bg-success",
    text: "text-success",
    border: "border-l-success border-l-4",
    stroke: "hsl(var(--success))",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  warning: {
    badge: "bg-warning",
    text: "text-warning",
    border: "border-l-warning border-l-4",
    stroke: "hsl(var(--warning))",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  danger: {
    badge: "bg-danger",
    text: "text-danger",
    border: "border-l-danger border-l-4",
    stroke: "hsl(var(--danger))",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

interface SensorCard {
  config: SensorConfig;
  value: number;
  status: Status;
  label: string;
  formatted: string;
  series: { v: number }[];
}

const Dashboard = () => {
  const { latest, history, lastEventAt } = useSensors();

  // Relógio interno para reavaliar a defasagem do dado mesmo sem novos eventos.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  const hasData = lastEventAt !== null;
  const isStale = hasData && now - lastEventAt.getTime() > STALE_MS;

  // Monta os cards a partir da config; só há dado quando já houve algum evento.
  const cards: SensorCard[] | null = hasData
    ? SENSOR_CONFIGS.map((config) => {
        const value = latest[config.key] ?? 0;
        const { status, label } = config.evaluate(value);
        return {
          config,
          value,
          status,
          label,
          formatted: config.format(value),
          series: history.map((h: HistoryPoint) => ({ v: h[config.key] })),
        };
      })
    : null;

  const dangers = cards?.filter((c) => c.status === "danger") ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo Seguro</h1>
          <h2 className="text-xl text-green-600 font-semibold mb-4">Zona 1</h2>
          <p className="text-muted-foreground">Monitoramento inteligente do solo</p>
        </div>

        {/* Alerta crítico no topo — derivado do status de qualquer sensor. */}
        {dangers.length > 0 && (
          <Alert className="mb-8 border-danger bg-danger/5">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <AlertDescription className="text-danger font-medium">
              <strong>ATENÇÃO</strong>
              <br />
              {dangers.map((d) => `${d.config.title}: ${d.label}`).join(" · ")} — verificação imediata recomendada.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards
            ? cards.map((card) => {
                const meta = STATUS_META[card.status];
                return (
                  <Card
                    key={card.config.key}
                    className={`transition-all duration-300 hover:shadow-lg ${meta.border} ${isStale ? "opacity-60" : ""}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${meta.text} bg-opacity-10`}>{card.config.icon}</div>
                          <CardTitle className="text-lg">{card.config.title}</CardTitle>
                        </div>
                        {/* Badge agora com ícone + texto (não depende só de cor). */}
                        <Badge variant="secondary" className={`${meta.badge} text-white gap-1`}>
                          {meta.icon}
                          {card.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* O número é o protagonista; o estado vira chip. */}
                      <div className={`text-3xl font-bold ${meta.text}`}>{card.formatted}</div>
                      <CardDescription className="text-xs mt-1">Leitura em tempo real</CardDescription>

                      {/* Mini tendência das últimas leituras. */}
                      {card.series.length > 1 && (
                        <div className="h-10 mt-3 -mx-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={card.series}>
                              <YAxis hide domain={["dataMin", "dataMax"]} />
                              <Line
                                type="monotone"
                                dataKey="v"
                                stroke={meta.stroke}
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            : // Skeletons enquanto aguarda o primeiro evento.
              SENSOR_CONFIGS.map((config) => (
                <Card key={config.key} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-muted">{config.icon}</div>
                      <CardTitle className="text-lg text-muted-foreground">{config.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-24 bg-muted rounded" />
                    <div className="h-10 mt-3 bg-muted/50 rounded" />
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Rodapé: hora da leitura + aviso de defasagem do dado. */}
        <Card className={isStale ? "border-warning" : ""}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                Última leitura
              </span>
              <div className="flex items-center gap-3">
                {isStale && (
                  <Badge variant="secondary" className="bg-warning text-white gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Dado defasado
                  </Badge>
                )}
                <span className="font-semibold">
                  {lastEventAt ? lastEventAt.toLocaleTimeString() : "Aguardando dados..."}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
