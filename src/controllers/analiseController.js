const ruaModel = require('../models/ruaModel')
const buracoModel = require('../models/buracoModel')

const returnQuantReport = async (req, res) => {

    const quantReport = await buracoModel.countDocuments({})
    const quantReportAberto = await buracoModel.countDocuments({status: "Aberto"})
    const quantReportFechado = await buracoModel.countDocuments({status: "Fechado"})
    
    
    res.json({TotalReport: quantReport, TotalReportAberto: quantReportAberto, TotalReportFechado: quantReportFechado});

}

const reportCritico = async (req, res) => {

}



module.exports = {returnQuantReport, reportCritico}