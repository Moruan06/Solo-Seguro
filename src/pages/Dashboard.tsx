import { Navigation } from "@/components/ui/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Thermometer, Droplet, FlaskConical, Wind, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const sensorData = [
    {
      title: "Temperatura",
      value: "Estável",
      icon: <Thermometer className="w-6 h-6" />,
      status: "good",
      sensor: "Temperatura ideal",
      color: "text-success"
    },
    {
      title: "Umidade",
      value: "Alerta",
      icon: <Droplet className="w-6 h-6" />,
      status: "warning",
      sensor: "Sensor FC-28",
      color: "text-warning"
    },
    {
      title: "pH",
      value: "Altamente Ácido",
      icon: <FlaskConical className="w-6 h-6" />,
      status: "danger",
      sensor: "Sensor pH400C",
      color: "text-danger"
    },
    {
      title: "Gás",
      value: "Crítico",
      icon: <Wind className="w-6 h-6" />,
      status: "danger",
      sensor: "Sensor MQ-135",
      color: "text-danger"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "danger": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success text-white";
      case "warning": return "bg-warning text-white";
      case "danger": return "bg-danger text-white";
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
    <div className="min-h-screen bg-subtle-gradient">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Solo Seguro</h1>
          <h2 className="text-xl text-earth-gradient font-semibold mb-4">Zona 1</h2>
          <p className="text-muted-foreground">Monitoramento inteligente do solo</p>
        </div>

        {/* Sensor Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sensorData.map((sensor, index) => (
            <Card key={index} className={`hover-lift ${getCardBorderColor(sensor.status)}`}>
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
                    className={`${getStatusColor(sensor.status)}`}
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

        {/* Last Reading */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Última leitura:</span>
              <span className="font-semibold">22:00</span>
            </div>
          </CardContent>
        </Card>

        {/* Alert */}
        <Alert className="border-danger bg-danger/5">
          <AlertTriangle className="h-4 w-4 text-danger" />
          <AlertDescription className="text-danger font-medium">
            <strong>ATENÇÃO</strong><br />
            Possível contaminação PMA
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
};

export default Dashboard;