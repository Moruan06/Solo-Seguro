import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import * as api from "@/lib/api";

interface AuthContextValue {
  token: string | null;
  user: api.AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => api.getToken());
  const [user, setUser] = useState<api.AuthUser | null>(() => api.getUser());

  const signIn = async (email: string, senha: string) => {
    const d = await api.login(email, senha);
    setToken(d.accessToken);
    setUser({ usuarioId: d.usuarioId, nome: d.nome, email: d.email, cargo: d.cargo });
  };

  const signOut = useCallback(async () => {
    await api.logout();
    setToken(null);
    setUser(null);
  }, []);

  // Logout automático quando o token expira (401 do backend)
  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener(api.SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(api.SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
