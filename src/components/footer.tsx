import { Leaf, ShieldCheck, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  const footerSections = [
    {
      title: "Produto",
      links: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Análises", href: "#analysis" },
        { label: "Relatórios", href: "#reports" },
        { label: "API", href: "#api" },
        { label: "Mobile App", href: "#mobile" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { label: "Sobre Nós", href: "#about" },
        { label: "Carreiras", href: "#careers" },
        { label: "Blog", href: "#blog" },
        { label: "Imprensa", href: "#press" },
        { label: "Parceiros", href: "#partners" }
      ]
    },
    {
      title: "Suporte",
      links: [
        { label: "Central de Ajuda", href: "#help" },
        { label: "Documentação", href: "#docs" },
        { label: "Status", href: "#status" },
        { label: "Comunidade", href: "#community" },
        { label: "Contato", href: "#contact" }
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        
        {/* Newsletter Section */}
        <div className="py-12 border-b border-background/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-4">
              Fique por Dentro das Novidades
            </h3>
            <p className="text-background/80 mb-6 max-w-2xl mx-auto">
              Receba insights sobre agricultura sustentável, updates do produto 
              e dicas de especialistas diretamente no seu email.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Seu melhor email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
              />
              <Button variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Inscrever
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <Leaf className="w-8 h-8 text-primary-light" />
                  <ShieldCheck className="w-4 h-4 text-accent-light absolute -bottom-1 -right-1" />
                </div>
                <span className="text-2xl font-display font-bold">
                  Soil Safety
                </span>
              </div>
              <p className="text-background/80 mb-6 max-w-md">
                Plataforma líder em monitoramento inteligente do solo, 
                ajudando produtores a maximizar a produtividade com 
                sustentabilidade.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-primary-light" />
                  <span>contato@soilsafety.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-primary-light" />
                  <span>+55 (11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary-light" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.href}
                        className="text-background/80 hover:text-background smooth-transition text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-background/60">
              © 2024 Soil Safety. Todos os direitos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-background/10 hover:bg-background/20 smooth-transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-background/60 hover:text-background smooth-transition">
                Privacidade
              </a>
              <a href="#terms" className="text-background/60 hover:text-background smooth-transition">
                Termos
              </a>
              <a href="#cookies" className="text-background/60 hover:text-background smooth-transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}