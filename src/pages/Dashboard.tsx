// src/pages/Dashboard.tsx

import { useState, useEffect } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Thermometer, Droplet, Wind, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

type SensorData = {
  temperature: number;
  percent: number;
  gas: number;
};

const Dashboard = () => {
  const [liveData, setLiveData] = useState<SensorData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.4.1/data");
        if (!response.ok) {
          throw new Error("Falha na rede ou o dispositivo não respondeu");
        }
        const data: SensorData = await response.json();
        setLiveData(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Erro ao buscar dados do sensor:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const getDisplayData = () => {
    if (!liveData) {
      return [
        { title: "Temperatura", value: "Carregando...", status: "loading", sensor: "...", color: "text-muted-foreground", icon: <Thermometer className="w-6 h-6" /> },
        { title: "Umidade", value: "Carregando...", status: "loading", sensor: "...", color: "text-muted-foreground", icon: <Droplet className="w-6 h-6" /> },
        { title: "Nível de Gás", value: "Carregando...", status: "loading", sensor: "...", color: "text-muted-foreground", icon: <Wind className="w-6 h-6" /> },
      ];
    }
    
    const { temperature, percent, gas } = liveData;
    
    const temperatureData = {
      title: "Temperatura",
      value: temperature > 30 ? "Alta" : temperature < 15 ? "Baixa" : "Estável",
      status: temperature > 30 ? "danger" : temperature < 15 ? "warning" : "good",
      sensor: `Leitura: ${temperature.toFixed(1)} °C`,
      color: temperature > 30 ? "text-danger" : temperature < 15 ? "text-warning" : "text-success",
      icon: <Thermometer className="w-6 h-6" />,
    };

    const humidityData = {
      title: "Umidade",
      value: percent > 70 ? "Úmido" : percent < 30 ? "Seco" : "Moderado",
      status: percent > 70 ? "good" : percent < 30 ? "danger" : "warning",
      sensor: `Leitura: ${percent}%`,
      color: percent > 70 ? "text-success" : percent < 30 ? "text-danger" : "text-warning",
      icon: <Droplet className="w-6 h-6" />,
    };

    // LÓGICA ATUALIZADA PARA O SENSOR DE GÁS COM MÚLTIPLOS NÍVEIS
    const getGasData = (gasValue: number) => {
      if (gasValue <= 700) {
        return {
          title: "Nível de Gás",
          value: "Bom",
          status: "good",
          sensor: `Valor Analógico: ${gasValue}`,
          color: "text-success",
          icon: <Wind className="w-6 h-6" />,
        };
      } else if (gasValue <= 1200) {
        return {
          title: "Nível de Gás",
          value: "Moderado",
          status: "warning",
          sensor: `Valor Analógico: ${gasValue}`,
          color: "text-warning",
          icon: <Wind className="w-6 h-6" />,
        };
      } else if (gasValue <= 2000) {
        return {
          title: "Nível de Gás",
          value: "Ruim",
          status: "danger",
          sensor: `Valor Analógico: ${gasValue}`,
          color: "text-danger",
          icon: <Wind className="w-6 h-6" />,
        };
      } else { // Acima de 2000
        return {
          title: "Nível de Gás",
          value: "Perigo",
          status: "danger",
          sensor: `Valor Analógico: ${gasValue}`,
          color: "text-danger font-bold",
          icon: <Wind className="w-6 h-6" />,
        };
      }
    };
    
    const gasData = getGasData(gas);

    return [temperatureData, humidityData, gasData];
  };

  const displayData = getDisplayData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "danger": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success";
      case "warning": return "bg-warning";
      case "danger": return "bg-danger";
      default: return "bg-muted";
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case "good": return "border-l-success border-l-4";
      case "warning": return "border-l-warning border-l-4";
      case "danger": return "border-l-danger border-l-4";
      default: return "";
    }
  };

  return (
  <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo Seguro</h1>
          <h2 className="text-xl text-green-600 font-semibold mb-4">Zona 1</h2>
          <p className="text-muted-foreground">Monitoramento inteligente do solo</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayData.map((sensor, index) => (
            <Card key={index} className={`transition-all duration-300 hover:shadow-lg ${getCardBorderColor(sensor.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${sensor.color} bg-opacity-10`}>
                      {sensor.icon}
                    </div>
                    <CardTitle className="text-lg">{sensor.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(sensor.status)} text-white`}
                  >
                    {getStatusIcon(sensor.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${sensor.color}`}>
                    {sensor.value}
                  </div>
                  <CardDescription className="text-sm">
                    {sensor.sensor}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Última leitura:</span>
              <span className="font-semibold">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "Aguardando dados..."}
              </span>
            </div>
          </CardContent>
        </Card>

        {liveData && liveData.gas > 700 && (
           <Alert className="border-danger bg-danger/5">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <AlertDescription className="text-danger font-medium">
              <strong>ATENÇÃO</strong><br />
              Nível de gás acima do normal detectado!
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
};

export default Dashboard;