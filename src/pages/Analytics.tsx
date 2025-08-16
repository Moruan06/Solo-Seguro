import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const Analytics = () => {
  // Sample data for today's temperature
  const todayData = [
    { time: "6:00", temp: 18 },
    { time: "9:00", temp: 22 },
    { time: "12:00", temp: 28 },
    { time: "15:00", temp: 32 },
    { time: "18:00", temp: 29 },
    { time: "21:00", temp: 25 },
    { time: "24:00", temp: 20 }
  ];

  // Sample data for last 7 days
  const weekData = [
    { day: "Seg", temp: 25 },
    { day: "Ter", temp: 27 },
    { day: "Qua", temp: 23 },
    { day: "Qui", temp: 28 },
    { day: "Sex", temp: 26 },
    { day: "Sáb", temp: 24 },
    { day: "Dom", temp: 27 }
  ];

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

        {/* Today's Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Hoje:
              <Badge variant="secondary" className="bg-success text-white">
                Estável
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={todayData}>
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
                    dataKey="temp" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">27°</div>
                <div className="text-sm text-muted-foreground">Média</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">24° - 30°</div>
                <div className="text-xs text-muted-foreground">Variação</div>
              </div>
              <div>
                <Badge variant="secondary" className="bg-success text-white">
                  Estável
                </Badge>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Última leitura:</span>
                <span className="font-semibold">22:00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last 7 Days Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos 7 dias:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekData}>
                  <XAxis 
                    dataKey="day" 
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
                    dataKey="temp" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;