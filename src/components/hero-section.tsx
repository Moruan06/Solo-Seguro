import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import heroImage from "@/assets/hero-soil-monitoring.jpg";

export function HeroSection() {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Análise em Tempo Real",
      description: "Monitoramento contínuo da qualidade do solo"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Alertas Inteligentes",
      description: "Notificações proativas sobre riscos"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Relatórios Automatizados",
      description: "Documentação completa e automática"
    }
  ];

  return (
    <section id="home" className="pt-16 min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 subtle-gradient" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                <span className="text-earth-gradient">Monitoramento</span><br />
                Inteligente do <span className="text-nature-gradient">Solo</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Plataforma avançada para análise da segurança e qualidade do solo com 
                tecnologia IoT e inteligência artificial para agricultura sustentável.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="earth" size="lg" className="group">
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 smooth-transition" />
              </Button>
              <Button variant="outline" size="lg">
                Ver Demonstração
              </Button>
            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="p-4 hover-lift border-border/50 bg-card/50 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative rounded-2xl overflow-hidden earth-shadow">
              <img
                src={heroImage}
                alt="Monitoramento inteligente do solo com tecnologia IoT"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 animate-float">
              <Card className="p-4 bg-card/90 backdrop-blur-sm glow-shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.2%</div>
                  <div className="text-xs text-muted-foreground">Precisão</div>
                </div>
              </Card>
            </div>
            
            <div className="absolute -top-6 -right-6 animate-float" style={{ animationDelay: "1s" }}>
              <Card className="p-4 bg-card/90 backdrop-blur-sm glow-shadow">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">24/7</div>
                  <div className="text-xs text-muted-foreground">Monitoramento</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}