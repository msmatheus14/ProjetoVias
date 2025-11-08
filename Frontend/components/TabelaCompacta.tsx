import Image from "next/image";

interface Props {
  TotalReport: number;
  TotalReportAberto: number;
  TotalReportFechado: number;
}

export default function TabelaCompacta({
  TotalReport,
  TotalReportAberto,
  TotalReportFechado,
}: Props) {
  const rows = [
    {
      label: "Total de reportes",
      value: TotalReport,
      color: "text-orange-400",
      icon: "/DashBoardIcons/grafico.png",
    },
    {
      label: "Reportes abertos",
      value: TotalReportAberto,
      color: "text-red-400",
      icon: "/DashBoardIcons/Abertos.png",
    },
    {
      label: "Reportes fechados",
      value: TotalReportFechado,
      color: "text-green-400",
      icon: "/DashBoardIcons/Fechados.png",
    },
  ];

  return (
    <div className="bg-[#1a1b1f]/05 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl p-6">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#2a2a2d]/40 last:border-none">
              <td className="py-2 text-gray-300">{row.label}</td>
              <td
                className={`py-2 font-semibold ${row.color} flex items-center gap-2`}
              >
                <Image src={row.icon} width={20} height={20} alt={row.label} />
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
