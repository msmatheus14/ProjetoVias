const ruaModel = require('../models/ruaModel')
const buracoModel = require('../models/buracoModel')

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

        for(buraco of buracosReport){
            if(buraco.localizacao.ruaID == rua_id){
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


module.exports = {returnQuantReport,  scoreReport}