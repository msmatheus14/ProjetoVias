"use client";

import { useEffect, useState } from "react";
import { Header } from "../../../components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { PieLabelRenderProps } from "recharts";

interface HistoricoData {
  mes: string;
  ano: number;
  total: number;
}

interface RuaInfo {
  id: string;
  nome: string;
  totalBuracos: number;
  totalConfirmacoes: number;
  totalCriticidade: number;
  score: number;
}

interface TotalReportData {
  TotalReport: number;
  TotalReportAberto: number;
  TotalReportFechado: number;
}

interface DashBoardData {
  TotalReport: number;
  TotalReportAberto: number;
  TotalReportFechado: number;
}


export default function Dashboard() {
  const [historico, setHistorico] = useState<HistoricoData[]>([]);
  const [ruas, setRuas] = useState<RuaInfo[]>([]);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [dashBoardData, setDashBoardData] = useState<DashBoardData | null>(null);

  useEffect(() => {
    async function fetchTotalReport() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DATABASE_URL}/TOTALREPORT`
        );
        const json: TotalReportData = await response.json();

        const formattedData = [
          { name: "Abertos", value: json.TotalReportAberto || 0 },
          { name: "Fechados", value: json.TotalReportFechado || 0 },
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchTotalReport();
  }, []);

 const fetchDashBoardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DATABASE_URL}/TOTALREPORT`);
      const json = await res.json();
      setDashBoardData(json);
    } catch (err) {
      console.error("Erro ao buscar dashboard:", err);
    }
  };

  const fetchData = async () => {
    try {
      const resHistorico = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/historico`
      );
      const jsonHistorico: HistoricoData[] = await resHistorico.json();

      const mesesOrdenados = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      const dataOrdenada = jsonHistorico.sort(
        (a, b) =>
          a.ano - b.ano ||
          mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes)
      );

      setHistorico(dataOrdenada);

      const resRuas = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/SCOREVIAS`
      );
      const jsonRuas: RuaInfo[] = await resRuas.json();
      setRuas(jsonRuas);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDashBoardData();
  }, []);

  return (
    <div>
      <Header />

      <div className="ml-10 relative min-h-screen bg-[#0f1115] text-white p-6 flex justify-center">
        <div className="grid grid-cols-[2fr_350px] gap-6 w-[75%] ml-20">
          {" "}
          <div className="flex flex-col gap-6">
            <div className="bg-[#1a1b1f]/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 flex items-center justify-center h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis
                    dataKey="mes"
                    stroke="#aaa"
                    tick={{ fill: "#aaa" }}
                    interval={0}
                    tickFormatter={(mes) => mes.substring(0, 3)}
                  />
                  <YAxis stroke="#aaa" tick={{ fill: "#aaa" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1b1f",
                      border: "none",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#f97316", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6 h-[230px]">
              {/* Total */}
              <div className="bg-[#1a1b1f]/80 rounded-2xl flex flex-col justify-center items-center p-6">
                <h3 className="text-3xl font-bold text-orange-400">
                  Total de Buracos
                </h3>
                <p className="text-6xl font-extrabold mt-2 text-white">
               {dashBoardData?.TotalReport ?? 0}
                </p>
              </div>

              <div className="bg-[#1a1b1f]/80 rounded-2xl flex flex-col items-center justify-center p-6">
                <h5 className="text-xl font-semibold mb-3">
                  Status dos Buracos
                </h5>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={60}
                      label={(props: PieLabelRenderProps) => {
                        const name = String(props.name ?? "");
                        const percent =
                          typeof props.percent === "number" ? props.percent : 0;
                        return `${name} (${Math.round(percent * 100)}%)`;
                      }}
                      isAnimationActive={false}
                    >
                      {data.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            entry.name === "Abertos" ? "#ef4444" : "#22c55e"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(
                        value: number,
                        name: string,
                        props
                      ) => {
                        const color =
                          props?.payload?.name === "Abertos"
                            ? "#ef4444"
                            : "#22c55e";
                        return [
                          <span key="value" style={{ color }}>
                            {value}
                          </span>,
                          <span key="name" style={{ color }}>
                            {name}
                          </span>,
                        ];
                      }}
                      contentStyle={{
                        backgroundColor: "#1a1b1f",
                        border: "none",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* COLUNA DIREITA */}
          <div className="bg-[#1a1b1f]/90 backdrop-blur-xl rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-gray-700 overflow-y-auto flex flex-col h-[700px]">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Ruas mais críticas
            </h2>
            <div className="space-y-4">
              {ruas.map((rua) => (
                <div
                  key={rua.id}
                  className="p-4 bg-[#202124] rounded-xl hover:bg-[#2a2b30] transition-colors"
                >
                  <h3 className="text-md font-bold text-white mb-2">
                    {rua.nome}
                  </h3>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      Buracos:{" "}
                      <span className="text-orange-400 font-semibold">
                        {rua.totalBuracos}
                      </span>
                    </p>
                    <p>
                      Confirmações:{" "}
                      <span className="text-orange-400 font-semibold">
                        {rua.totalConfirmacoes}
                      </span>
                    </p>
                    <p>
                      Criticidade:{" "}
                      <span className="text-orange-400 font-semibold">
                        {rua.totalCriticidade}
                      </span>
                    </p>
                    <p>
                      Score:{" "}
                      <span className="text-red-400 font-bold">
                        {rua.score}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
