import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, ShieldCheck, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { ThemeContext } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import { useSensors } from "@/contexts/SensorContext";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { user, signOut } = useAuth();
  const { connected } = useSensors();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Mapa", href: "/map" },
    { label: "Análises", href: "/analytics" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Leaf className="w-8 h-8 text-primary" />
              <ShieldCheck className="w-4 h-4 text-accent absolute -bottom-1 -right-1" />
            </div>
            <span className="text-xl font-display font-bold text-earth-gradient">
              Solo Seguro
            </span>
            {/* Indicador de stream em tempo real */}
            <span
              className={cn(
                "ml-2 inline-flex items-center gap-1 text-xs font-medium",
                connected ? "text-success" : "text-muted-foreground"
              )}
              title={connected ? "Recebendo leituras em tempo real" : "Stream desconectado"}
            >
              <span className={cn("w-2 h-2 rounded-full", connected ? "bg-success animate-pulse" : "bg-muted-foreground")} />
              {connected ? "ao vivo" : "off"}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-foreground hover:text-primary smooth-transition font-medium"
              >
                {item.label}
              </Link>
            ))}
            {user?.nome && (
              <span className="text-sm text-muted-foreground">
                {user.nome}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Sair">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-foreground hover:text-primary smooth-transition font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" /> Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
