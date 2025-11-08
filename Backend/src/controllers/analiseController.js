
import ruaModel from '../models/ruaModel.js'
import  buracoModel from '../models/buracoModel.js'


const returnQuantReport = async (req, res) => {

    const quantReport = await buracoModel.countDocuments({})
    const quantReportAberto = await buracoModel.countDocuments({status: "Aberto"})
    const quantReportFechado = await buracoModel.countDocuments({status: "Fechado"})
    
    
    res.json({TotalReport: quantReport, TotalReportAberto: quantReportAberto, TotalReportFechado: quantReportFechado});

}

const scoreReport = async (req, res) => {

    const ruas = await ruaModel.find()
    const buracosReport = await buracoModel.find()
    
    const result = []


    for (const rua of ruas) {

        const rua_id = rua._id.toString()
        const buracos = []

        for(let buraco of buracosReport){

            if(buraco.localizacao.ruaID == rua_id && buraco.status == "Aberto"){
                buracos.push(buraco)
            }
        }

        
        let totalBuraco = buracos.length
        let totalConfirmacoes = 0
        let totalCriticidade = 0

        for (const buraco of buracos) {

            totalCriticidade += buraco.criticidade
            totalConfirmacoes += buraco.confirmacoes
        }

        

        const pesoTotalBuracos = 5
        const pesoTotalConfirmacoes = 4
        const pesoTotalCriticidade = 4

        const score = (pesoTotalCriticidade * totalCriticidade) + (pesoTotalConfirmacoes * totalConfirmacoes) + (pesoTotalBuracos * totalBuraco)
        
        
        if(totalBuraco != 0){

            result.push({
    
                id: rua._id,
                nome: rua.nome,
                totalBuracos: totalBuraco,
                totalConfirmacoes: totalConfirmacoes,
                totalCriticidade: totalCriticidade,
                score: score
            })

        }

    }

    result.sort((a, b) => b.score - a.score);
        
        res.json(result)


    }

  const historicoReport = async (req, res) => {
    try {
        const hoje = new Date();
        const dozeMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1);

        const reports = await buracoModel.find({
            data: { $gte: dozeMesesAtras }
        });

        const contador = {};

        reports.forEach(report => {

            const d = new Date(report.data)

            const mesAno = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`
            
            contador[mesAno] = (contador[mesAno] || 0) + 1;
        });

        const nomesMeses = [

            "Janeiro", "Fevereiro", "Março", "Abril",
            "Maio", "Junho", "Julho", "Agosto",
            "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const resultado = []

        for (let i = 0; i < 12; i++) {

            const d = new Date(hoje.getFullYear(), hoje.getMonth() - 11 + i, 1)

            const mesAnoKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`

            resultado.push({

                mes: nomesMeses[d.getMonth()],

                ano: d.getFullYear(),

                total: contador[mesAnoKey] || 0

            });
        }

        res.json(resultado)

    } catch (err) {

        console.error(err)

        res.status(500).json({ error: "Erro ao gerar relatório" });

    }
};



export { returnQuantReport, scoreReport, historicoReport };
