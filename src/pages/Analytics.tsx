import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Analytics = () => {
  type SensorData = {
    time: string;
    temperature: number;
    percent: number;
    gas: number;
  };
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.4.1/data");
        if (!response.ok) return;
        const data = await response.json();
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setSensorHistory(prev => [
          ...prev.slice(-49),
          { time, temperature: data.temperature, percent: data.percent, gas: data.gas }
        ]);
        setLastUpdated(time);
      } catch (err) {
        console.error('Erro ao buscar dados do sensor:', err);
      }
    };
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);


  return (
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo Seguro</h1>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Thermometer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-earth-gradient font-semibold">Temperatura do solo</h2>
              <p className="text-sm text-muted-foreground">Sensor: DTH22</p>
            </div>
          </div>
        </div>

        {/* Gráfico de Temperatura */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Temperatura
              <Badge variant="secondary" className="bg-success text-white">
                {sensorHistory.length > 0 ? "Online" : "Aguardando..."}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorHistory}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                    name="Temperatura"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-right text-xs text-muted-foreground">
              Última leitura: {lastUpdated || "Aguardando..."}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Umidade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Umidade
              <Badge variant="secondary" className="bg-primary text-white">
                {sensorHistory.length > 0 ? "Online" : "Aguardando..."}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorHistory}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percent" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    name="Umidade"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-right text-xs text-muted-foreground">
              Última leitura: {lastUpdated || "Aguardando..."}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Gás */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Gás
              <Badge variant="secondary" className="bg-danger text-white">
                {sensorHistory.length > 0 ? "Online" : "Aguardando..."}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorHistory}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gas" 
                    stroke="hsl(var(--danger))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--danger))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--danger))', strokeWidth: 2 }}
                    name="Gás"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-right text-xs text-muted-foreground">
              Última leitura: {lastUpdated || "Aguardando..."}
            </div>
          </CardContent>
        </Card>

        {/* Cards interativos para cada sensor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temperatura */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {sensorHistory.length > 0 ? `${(
                    sensorHistory.reduce((acc, cur) => acc + cur.temperature, 0) / sensorHistory.length
                  ).toFixed(1)}°` : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Média</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Variação: {sensorHistory.length > 0 ? `${
                    Math.min(...sensorHistory.map(d => d.temperature))
                  }° - ${
                    Math.max(...sensorHistory.map(d => d.temperature))
                  }°` : '--'}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última leitura:</span>
                    <span className="font-semibold">
                      {sensorHistory.length > 0 ? `${sensorHistory[sensorHistory.length-1].temperature}°` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Umidade */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {sensorHistory.length > 0 ? `${(
                    sensorHistory.reduce((acc, cur) => acc + cur.percent, 0) / sensorHistory.length
                  ).toFixed(1)}%` : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Média</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Variação: {sensorHistory.length > 0 ? `${
                    Math.min(...sensorHistory.map(d => d.percent))
                  }% - ${
                    Math.max(...sensorHistory.map(d => d.percent))
                  }%` : '--'}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última leitura:</span>
                    <span className="font-semibold">
                      {sensorHistory.length > 0 ? `${sensorHistory[sensorHistory.length-1].percent}%` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Gás */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-danger">
                  {sensorHistory.length > 0 ? `${(
                    sensorHistory.reduce((acc, cur) => acc + cur.gas, 0) / sensorHistory.length
                  ).toFixed(0)}` : '--'}
                </div>
                <div className="text-sm text-muted-foreground">Média</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Variação: {sensorHistory.length > 0 ? `${
                    Math.min(...sensorHistory.map(d => d.gas))
                  } - ${
                    Math.max(...sensorHistory.map(d => d.gas))
                  }` : '--'}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última leitura:</span>
                    <span className="font-semibold">
                      {sensorHistory.length > 0 ? sensorHistory[sensorHistory.length-1].gas : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default Analytics;