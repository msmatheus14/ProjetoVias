"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      const success = await login(username, password);

      if (!success) {
        toast.error("Usuário ou senha inválidos");
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-black">

      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
        style={{
          backgroundImage: "url('/login/fundo.jpeg')", 
        }}
      ></div>


      <div className="absolute inset-0 bg-black/70"></div>

 
      <div className="relative z-10 bg-[#0f1624]/80 border border-[#1e293b]/60 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] w-96 text-white flex flex-col items-center">

      
        <div className="absolute -top-10 bg-[#1e293b] rounded-full p-4 border-4 border-[#0f1624] shadow-md">
          <User size={42} className="text-[#9ca3af]" />
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-6 text-gray-200 tracking-wide">
          Acessar Painel
        </h2>

       
        <form onSubmit={handleSubmit} className="w-full">
          <label className="block mb-2 text-sm text-gray-400">Usuário</label>
          <input
            type="text"
            placeholder="Digite seu login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-5 p-3 rounded-lg bg-[#1a2235]/80 border border-[#2d3748]/60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 placeholder-gray-500 text-sm text-gray-200"
          />

          <label className="block mb-2 text-sm text-gray-400">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 rounded-lg bg-[#1a2235]/80 border border-[#2d3748]/60 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 placeholder-gray-500 text-sm text-gray-200"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm tracking-wide transition-all ${
              loading
                ? "bg-[#1e293b] text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#2b3a55] to-[#1e293b] hover:from-[#32415f] hover:to-[#253149] shadow-[0_0_15px_rgba(0,0,0,0.4)]"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
