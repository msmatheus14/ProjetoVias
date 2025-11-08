"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/ValidarUsuario`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: username, senha: password }),
        }
      );

      if (!res.ok) return false;

      
      const data: { login: boolean } = await res.json();
 
      if (data.login) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        router.push("/");
        return true;
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {isAuthenticated === null ? (
        <div className="h-screen flex items-center justify-center text-white">
          Carregando...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
