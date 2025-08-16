import { Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import dashboardImage from "@/assets/dashboard-preview.jpg";

export function DashboardSection() {
  const metrics = [
    {
      title: "pH do Solo",
      value: "6.8",
      change: "+0.2",
      trend: "up",
      status: "good",
      progress: 68
    },
    {
      title: "Umidade",
      value: "45%",
      change: "-5%",
      trend: "down",
      status: "warning",
      progress: 45
    },
    {
      title: "Nutrientes",
      value: "Ótimo",
      change: "+12%",
      trend: "up",
      status: "good",
      progress: 88
    },
    {
      title: "Temperatura",
      value: "22°C",
      change: "+1°C",
      trend: "up",
      status: "good",
      progress: 75
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-success";
      case "warning": return "bg-warning";
      case "danger": return "bg-danger";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "danger": return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <section id="dashboard" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Dashboard <span className="text-earth-gradient">Inteligente</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize todos os dados do seu solo em tempo real com nossa interface 
            intuitiva e relatórios detalhados.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Metrics Grid */}
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <Card 
                  key={index}
                  className="hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`${getStatusColor(metric.status)} text-white`}
                      >
                        {getStatusIcon(metric.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <div className="flex items-center space-x-1 text-sm">
                          <TrendingUp 
                            className={`w-4 h-4 ${
                              metric.trend === 'up' ? 'text-success' : 'text-danger'
                            }`} 
                          />
                          <span className={
                            metric.trend === 'up' ? 'text-success' : 'text-danger'
                          }>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Card */}
            <Card className="soil-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Status Geral</h3>
                  <p className="text-white/90">
                    Solo em condições ideais para plantio. Recomenda-se irrigação 
                    nos próximos 2 dias.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">92%</div>
                  <div className="text-sm text-white/80">Qualidade</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Dashboard Preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative rounded-2xl overflow-hidden earth-shadow">
              <img
                src={dashboardImage}
                alt="Preview do dashboard de monitoramento do solo"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            </div>
            
            {/* Overlay Stats */}
            <div className="absolute top-4 left-4">
              <Card className="p-3 bg-card/95 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}