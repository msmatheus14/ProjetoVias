"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  dados: Rua[];
  atualizarRuas: () => void;
};

export interface Rua {
  _id: string;
  nome: string;
  cidadeId: string;
  __v: number;
}

export default function TabelaRuas({ dados, atualizarRuas }: Props) {
  const [filtro, setFiltro] = useState("");
  const [loadingButtons, setLoadingButtons] = useState<{ [key: string]: boolean }>({});

  const ruasFiltradas = dados.filter((rua) =>
    rua.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const AlterarStatusBuracos = async (ruaId: string) => {
    if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
      console.error("NEXT_PUBLIC_DATABASE_URL is not defined");
      toast.error("Erro de configuração: URL da API não encontrada");
      return;
    }

    try {
      setLoadingButtons((prev) => ({ ...prev, [ruaId]: true }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DATABASE_URL}/UPDATERUAS`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruaId }),
        }
      );

      if (!response.ok) throw new Error("Erro ao enviar requisição");

      toast.success("Os status dos buracos dessa rua foram atualizados!");

      atualizarRuas();

    } catch (erro) {
      console.error(erro);
      toast.error("Falha ao arrumar os buracos.");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [ruaId]: false }));
    }
  };

  return (
    <div className=" max-w-4xl mx-auto">

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Filtrar por nome da rua"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="block w-full p-3 pl-10 text-sm text-gray-200 border border-gray-700 rounded-lg bg-[#202124] focus:ring-orange-400 focus:border-orange-400 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 1 0-14 0 7 7 0 0 0 14 0Z"
              />
            </svg>
          </div>
        </div>
      </div>

  
      <div className="overflow-x-auto rounded-lg shadow-md border border-[#2a2a2d]">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="text-xs uppercase bg-[#222329] text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">Rua</th>
              <th scope="col" className="px-6 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {ruasFiltradas.map((rua) => (
              <tr
                key={rua._id}
                className="bg-[#1a1b1f] hover:bg-[#2a2b30] transition-colors"
              >
                <td className="px-6 py-4 font-medium">{rua.nome}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      !loadingButtons[rua._id] && AlterarStatusBuracos(rua._id)
                    }
                    disabled={loadingButtons[rua._id]}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      loadingButtons[rua._id]
                        ? "bg-gray-600 cursor-not-allowed text-gray-200"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {loadingButtons[rua._id] ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3v1.5M14.25 3v1.5M3.75 6.75h16.5M4.5 6.75l.75 12a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25l.75-12"
                          />
                        </svg>
                        Arrumar buracos
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {ruasFiltradas.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-400">
                  Nenhuma rua encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
