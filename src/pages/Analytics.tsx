import { useEffect, useState, useCallback, useMemo } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useSensors } from "@/contexts/SensorContext";
import { getHistoricoSensor, getAgregado, PontoHistorico, Agregado } from "@/lib/api";

type MetricKey = "temperature" | "percent" | "gas" | "ph";

interface MetricCfg {
  key: MetricKey;
  titulo: string;
  unidade: string;
  cor: string;
}

const METRICAS: MetricCfg[] = [
  { key: "percent", titulo: "Umidade do Solo", unidade: "%", cor: "hsl(var(--primary))" },
  { key: "gas", titulo: "Gás", unidade: "raw", cor: "hsl(var(--danger))" },
  { key: "temperature", titulo: "Temperatura", unidade: "°C", cor: "hsl(var(--success))" },
  { key: "ph", titulo: "pH do Solo", unidade: "pH", cor: "hsl(var(--warning))" },
];

// Presets de janela móvel (sempre relativos a "agora").
const PRESETS = [
  { value: "1h", label: "Última 1 hora", ms: 3600e3 },
  { value: "6h", label: "Últimas 6 horas", ms: 6 * 3600e3 },
  { value: "24h", label: "Últimas 24 horas", ms: 24 * 3600e3 },
  { value: "7d", label: "Últimos 7 dias", ms: 7 * 24 * 3600e3 },
];
const CUSTOM = "custom";

interface MetricData {
  serie: PontoHistorico[];
  agg: Agregado | null;
}

const VAZIO: Record<MetricKey, MetricData> = {
  temperature: { serie: [], agg: null },
  percent: { serie: [], agg: null },
  gas: { serie: [], agg: null },
  ph: { serie: [], agg: null },
};

// Resolve a janela [início, fim] a partir do preset selecionado ou do
// intervalo personalizado. Presets são relativos a "agora" (calculado na hora
// da chamada); o personalizado usa dias inteiros das datas escolhidas.
function resolverJanela(preset: string, custom: DateRange | undefined): { inicio: Date; fim: Date } | null {
  if (preset === CUSTOM) {
    if (!custom?.from) return null;
    return { inicio: startOfDay(custom.from), fim: endOfDay(custom.to ?? custom.from) };
  }
  const cfg = PRESETS.find((p) => p.value === preset) ?? PRESETS[2];
  const fim = new Date();
  return { inicio: new Date(fim.getTime() - cfg.ms), fim };
}

const Analytics = () => {
  const { sensorIds, connected } = useSensors();
  const [preset, setPreset] = useState<string>("24h");
  const [custom, setCustom] = useState<DateRange | undefined>();
  const [calOpen, setCalOpen] = useState(false);
  const [dados, setDados] = useState<Record<MetricKey, MetricData>>(VAZIO);
  const [carregando, setCarregando] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  // Janela personalizada ainda incompleta: pausa o fetch até escolher datas.
  const customIncompleto = preset === CUSTOM && !custom?.from;

  const carregar = useCallback(async () => {
    const janela = resolverJanela(preset, custom);
    if (!janela) return; // personalizado sem datas selecionadas
    const inicioIso = janela.inicio.toISOString();
    const fimIso = janela.fim.toISOString();

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
  }, [preset, custom, sensorIds]);

  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 15000); // auto-refresh a cada 15s
    return () => clearInterval(id);
  }, [carregar]);

  // Texto humano da janela ativa, exibido no subtítulo.
  const janelaTexto = useMemo(() => {
    if (preset === CUSTOM) {
      if (!custom?.from) return "selecione um intervalo";
      const ini = format(custom.from, "dd/MM/yy", { locale: ptBR });
      const fim = format(custom.to ?? custom.from, "dd/MM/yy", { locale: ptBR });
      return ini === fim ? ini : `${ini} → ${fim}`;
    }
    return (PRESETS.find((p) => p.value === preset) ?? PRESETS[2]).label.toLowerCase();
  }, [preset, custom]);

  // Rótulo do botão de calendário.
  const calLabel = custom?.from
    ? custom.to
      ? `${format(custom.from, "dd/MM")} – ${format(custom.to, "dd/MM")}`
      : format(custom.from, "dd/MM")
    : "Escolher datas";

  const onPresetChange = (value: string) => {
    setPreset(value);
    if (value === CUSTOM) setCalOpen(true); // abre o calendário ao escolher "Personalizado"
  };

  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />

      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Cabeçalho + controles */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Análises</h1>
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">{janelaTexto}</span>
              {atualizadoEm && ` · atualizado às ${atualizadoEm.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={preset} onValueChange={onPresetChange}>
              <SelectTrigger className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value={CUSTOM}>Personalizado…</SelectItem>
              </SelectContent>
            </Select>

            {preset === CUSTOM && (
              <Popover open={calOpen} onOpenChange={setCalOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {calLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={custom}
                    onSelect={setCustom}
                    numberOfMonths={2}
                    locale={ptBR}
                    disabled={{ after: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={carregar}
              disabled={carregando || customIncompleto}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? "animate-spin" : ""}`} />
              {carregando ? "Atualizando..." : "Atualizar"}
            </Button>
          </div>
        </div>

        {/* Personalizado sem datas: orienta antes de mostrar gráficos vazios. */}
        {customIncompleto ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
              <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Escolha uma data de início e fim para visualizar o histórico.
              </p>
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setCalOpen(true)}>
                <CalendarIcon className="w-4 h-4" />
                Escolher datas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
          {METRICAS.map((m) => {
          const d = dados[m.key];
          const semId = !sensorIds[m.key];
          return (
            <Card key={m.key}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>
                    {m.titulo}{" "}
                    <span className="text-xs text-muted-foreground">({m.unidade})</span>
                  </span>
                  <Badge variant="secondary" className={`text-xs ${connected ? "bg-success text-white" : "bg-muted"}`}>
                    {connected ? "ao vivo" : "histórico"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {semId ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Aguardando primeira leitura...
                  </p>
                ) : d.serie.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Sem leituras nesse período.
                  </p>
                ) : (
                  <>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={d.serie}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} className="text-xs" minTickGap={40} />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" width={36} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              fontSize: "0.75rem",
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
                      <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                        <Resumo rotulo="Média" valor={d.agg.media} unidade={m.unidade} />
                        <Resumo rotulo="Mín" valor={d.agg.minimo} unidade={m.unidade} />
                        <Resumo rotulo="Máx" valor={d.agg.maximo} unidade={m.unidade} />
                        <Resumo rotulo="Leituras" valor={d.agg.total} />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
          })}
          </div>
        )}
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
