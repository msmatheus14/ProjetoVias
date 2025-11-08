'use client';

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MarkerType } from "../../components/Map";
import ProtectedRoute from "../context/protectRoute";
import { Header } from "../../components/Header";
import RuasCriticas from "../../components/RuasCriticas";
import TabelaCompacta from "../../components/TabelaCompacta";

const Maps = dynamic(() => import("../../components/Map"), { ssr: false });

interface DashBoardData {
  TotalReport: number;
  TotalReportAberto: number;
  TotalReportFechado: number;
}

interface RuaInfo {
  id: string;
  nome: string;
  totalBuracos: number;
  totalConfirmacoes: number;
  totalCriticidade: number;
  score: number;
}

export default function VerBuracos() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [ruasCriticas, setRuasCriticas] = useState<RuaInfo[]>([]);
  const [dashBoardData, setDashBoardData] = useState<DashBoardData | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        (err) => console.error("Erro ao obter localização:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);


  const fetchMarkers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/RETORNARTODOSBURACOS`);
      const json = await res.json();
      setMarkers(json);
    } catch (err) {
      console.error("Erro ao buscar markers:", err);
    }
  };

  const fetchDashBoardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/TOTALREPORT`);
      const json = await res.json();
      setDashBoardData(json);
    } catch (err) {
      console.error("Erro ao buscar dashboard:", err);
    }
  };

  const fetchRuasCriticas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/SCOREVIAS`);
      const json = await res.json();
      setRuasCriticas(json);
    } catch (err) {
      console.error("Erro ao buscar ruas críticas:", err);
    }
  };

 
  useEffect(() => {
    fetchMarkers();
    fetchDashBoardData();
    fetchRuasCriticas();

    const interval = setInterval(() => {
      fetchMarkers();
      fetchDashBoardData();
      fetchRuasCriticas();
    }, 10000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <ProtectedRoute>
      <div className="relative flex bg-[#0e0e11] text-white min-h-screen overflow-hidden">
        

        <Header />


        <div className="flex-1 relative h-screen">


          <div className="absolute inset-0 z-0">
            <Maps markers={markers} location={location} />
          </div>


          <div className="absolute right-0 top-0 bottom-0 w-[370px] flex flex-col gap-6 pt-6 px-3 overflow-y-auto z-10 shadow-lg">
            <TabelaCompacta
              TotalReport={dashBoardData?.TotalReport ?? 0}
              TotalReportAberto={dashBoardData?.TotalReportAberto ?? 0}
              TotalReportFechado={dashBoardData?.TotalReportFechado ?? 0}
            />
            <RuasCriticas ruas={ruasCriticas} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
