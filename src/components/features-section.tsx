import { 
  Smartphone, 
  CloudRain, 
  BarChart3, 
  Shield, 
  Cpu, 
  Globe,
  ChevronRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import soilAnalysisIcon from "@/assets/icon-soil-analysis.jpg";

export function FeaturesSection() {
  const features = [
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IoT Avançado",
      description: "Sensores inteligentes para coleta de dados em tempo real com precisão científica.",
      details: ["Sensores NPK", "pH metros digitais", "Medidores de umidade", "Termômetros do solo"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Análise Preditiva",
      description: "IA que prevê problemas antes que aconteçam, otimizando sua produção.",
      details: ["Previsão de pragas", "Alertas de deficiência", "Cronograma de irrigação", "Análise de tendências"]
    },
    {
      icon: <CloudRain className="w-8 h-8" />,
      title: "Integração Climática",
      description: "Dados meteorológicos integrados para decisões mais precisas.",
      details: ["Previsão do tempo", "Índice UV", "Probabilidade de chuva", "Velocidade do vento"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "App Mobile",
      description: "Acesse seus dados de qualquer lugar com nosso aplicativo intuitivo.",
      details: ["Notificações push", "Dashboard móvel", "Relatórios offline", "Sincronização automática"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Segurança Avançada",
      description: "Seus dados protegidos com criptografia de nível militar.",
      details: ["Criptografia AES-256", "Backup automático", "Controle de acesso", "Auditoria completa"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Relatórios Globais",
      description: "Conformidade com padrões internacionais de agricultura sustentável.",
      details: ["Certificação ISO", "Padrões FAO", "Relatórios ESG", "Auditoria ambiental"]
    }
  ];

  return (
    <section id="analysis" className="py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden earth-shadow">
              <img 
                src={soilAnalysisIcon} 
                alt="Ícone de análise do solo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Recursos <span className="text-earth-gradient">Avançados</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa plataforma combina tecnologia de ponta com expertise em agricultura 
            para oferecer a mais completa solução de monitoramento do solo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover-lift h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-xl soil-gradient p-4 text-white mb-4 group-hover:scale-110 smooth-transition">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <Card className="max-w-4xl mx-auto nature-gradient p-8 md:p-12 text-white">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold">
                Pronto para Revolucionar sua Agricultura?
              </h3>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Junte-se a mais de 10.000 produtores que já transformaram 
                suas operações com nossa tecnologia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  Teste Grátis por 30 Dias
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}