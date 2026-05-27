import { useEffect, useState, useCallback } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useSensors } from "@/contexts/SensorContext";
import { getHistoricoSensor, getAgregado, PontoHistorico, Agregado } from "@/lib/api";

type MetricKey = "temperature" | "percent" | "gas";

interface MetricCfg {
  key: MetricKey;
  titulo: string;
  unidade: string;
  cor: string;
}

const METRICAS: MetricCfg[] = [
  { key: "percent", titulo: "Umidade do Solo", unidade: "%", cor: "hsl(var(--primary))" },
  { key: "gas", titulo: "Gás", unidade: "ppm", cor: "hsl(var(--danger))" },
  { key: "temperature", titulo: "Temperatura", unidade: "°C", cor: "hsl(var(--success))" },
];

const RANGES = [
  { label: "1h", ms: 3600e3 },
  { label: "6h", ms: 6 * 3600e3 },
  { label: "24h", ms: 24 * 3600e3 },
  { label: "7d", ms: 7 * 24 * 3600e3 },
];

interface MetricData {
  serie: PontoHistorico[];
  agg: Agregado | null;
}

const VAZIO: Record<MetricKey, MetricData> = {
  temperature: { serie: [], agg: null },
  percent: { serie: [], agg: null },
  gas: { serie: [], agg: null },
};

const Analytics = () => {
  const { sensorIds, connected } = useSensors();
  const [rangeMs, setRangeMs] = useState<number>(24 * 3600e3);
  const [dados, setDados] = useState<Record<MetricKey, MetricData>>(VAZIO);
  const [carregando, setCarregando] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  const carregar = useCallback(async () => {
    const fim = new Date();
    const inicio = new Date(fim.getTime() - rangeMs);
    const fimIso = fim.toISOString();
    const inicioIso = inicio.toISOString();

    setCarregando(true);
    try {
      const entries = await Promise.all(
        METRICAS.map(async (m) => {
          const sid = sensorIds[m.key];
          if (!sid) return [m.key, { serie: [], agg: null }] as const;
          const [serie, agg] = await Promise.all([
            getHistoricoSensor(sid, inicioIso, fimIso).catch(() => [] as PontoHistorico[]),
            getAgregado(sid, inicioIso, fimIso).catch(() => null),
          ]);
          return [m.key, { serie, agg }] as const;
        }),
      );
      setDados(Object.fromEntries(entries) as Record<MetricKey, MetricData>);
      setAtualizadoEm(new Date());
    } finally {
      setCarregando(false);
    }
  }, [rangeMs, sensorIds]);

  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 15000); // auto-refresh a cada 15s
    return () => clearInterval(id);
  }, [carregar]);

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />

      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Cabeçalho + controles */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Análises</h1>
            <p className="text-sm text-muted-foreground">
              Histórico persistido no banco
              {atualizadoEm && ` · atualizado às ${atualizadoEm.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {RANGES.map((r) => (
              <Button
                key={r.label}
                size="sm"
                variant={r.ms === rangeMs ? "default" : "outline"}
                onClick={() => setRangeMs(r.ms)}
              >
                {r.label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={carregar} disabled={carregando}>
              {carregando ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        {/* Um card por métrica */}
        {METRICAS.map((m) => {
          const d = dados[m.key];
          const semId = !sensorIds[m.key];
          return (
            <Card key={m.key} className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {m.titulo}{" "}
                    <span className="text-sm text-muted-foreground">({m.unidade})</span>
                  </span>
                  <Badge variant="secondary" className={connected ? "bg-success text-white" : "bg-muted"}>
                    {connected ? "ao vivo" : "histórico"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {semId ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">
                    Sensor ainda não identificado — aguardando a primeira leitura para carregar o histórico.
                  </p>
                ) : d.serie.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-10 text-center">
                    Sem leituras nesse período.
                  </p>
                ) : (
                  <>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={d.serie}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs" minTickGap={32} />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" width={40} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            stroke={m.cor}
                            strokeWidth={2}
                            dot={false}
                            name={m.titulo}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {d.agg && (
                      <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                        <Resumo rotulo="Média" valor={d.agg.media} unidade={m.unidade} />
                        <Resumo rotulo="Mínimo" valor={d.agg.minimo} unidade={m.unidade} />
                        <Resumo rotulo="Máximo" valor={d.agg.maximo} unidade={m.unidade} />
                        <Resumo rotulo="Leituras" valor={d.agg.total} />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

function Resumo({ rotulo, valor, unidade }: { rotulo: string; valor: number; unidade?: string }) {
  const texto = unidade ? `${valor.toFixed(1)}${unidade}` : `${valor}`;
  return (
    <div className="pt-4 border-t">
      <div className="text-xl font-bold text-foreground">{texto}</div>
      <div className="text-xs text-muted-foreground">{rotulo}</div>
    </div>
  );
}

export default Analytics;
