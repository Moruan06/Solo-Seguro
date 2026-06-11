import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ShieldCheck, Eye, EyeOff, Loader2, Activity, Bell, LineChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const DESTAQUES = [
  { icon: Activity, texto: "Leituras de temperatura, umidade e gás em tempo real" },
  { icon: Bell, texto: "Alertas imediatos quando algo sai do normal" },
  { icon: LineChart, texto: "Histórico e análises persistidos no banco" },
];

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await signIn(email, senha);
      navigate("/");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel de marca — escondido em telas pequenas. */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white nature-gradient lg:flex">
        {/* Marca d'água decorativa. */}
        <Leaf className="pointer-events-none absolute -right-10 -bottom-10 h-80 w-80 text-white/10" aria-hidden />

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <Leaf className="h-9 w-9" />
            <ShieldCheck className="absolute -bottom-1 -right-1 h-5 w-5" />
          </div>
          <span className="text-2xl font-bold">Solo Seguro</span>
        </div>

        <div className="relative">
          <h1 className="mb-3 text-4xl font-bold leading-tight">
            Monitoramento inteligente do solo
          </h1>
          <p className="mb-8 max-w-md text-white/80">
            Acompanhe seus sensores e proteja sua plantação com dados em tempo real.
          </p>
          <ul className="space-y-3">
            {DESTAQUES.map(({ icon: Icon, texto }) => (
              <li key={texto} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/90">{texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">© {new Date().getFullYear()} Solo Seguro</p>
      </aside>

      {/* Painel do formulário — agora dentro de um card. */}
      <main className="flex flex-1 items-center justify-center bg-subtle-gradient px-4 py-12">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            {/* Logo — destaque também no mobile, onde o painel lateral some. */}
            <div className="mb-2 flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Leaf className="h-9 w-9 text-primary" />
                <ShieldCheck className="absolute -bottom-1 -right-1 h-5 w-5 text-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl text-earth-gradient">Solo Seguro</CardTitle>
            <CardDescription>Entre para acompanhar seus sensores</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showSenha ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pr-10"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {erro && (
                <Alert className="border-danger bg-danger/5">
                  <AlertDescription className="text-danger">{erro}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
