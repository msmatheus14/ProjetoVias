"use client";

import TabelaRuas from "../../../components/TabelaRuas";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../context/protectRoute";
import { Header } from "../../../components/Header";

export interface Rua {
  _id: string;
  nome: string;
  cidadeId: string;
  __v: number;
}

export default function Buracos() {
  const [ruas, setRuas] = useState<Rua[]>([]);

  const fetchRuas = () => {
    if (!process.env.NEXT_PUBLIC_DATABASE_URL) return;

    fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/GETRUAS`)
      .then((res) => res.json())
      .then((json) => setRuas(json))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchRuas();
  }, []);

  return (
    <ProtectedRoute>
      <Header />
      <div className="bg-[#1a1b1f] min-h-screen p-6">
        <TabelaRuas dados={ruas} atualizarRuas={fetchRuas} />
      </div>
    </ProtectedRoute>
  );
}
