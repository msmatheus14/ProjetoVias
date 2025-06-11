
const {adicionarReportBuraco, aumentarConfirmacao, verificarExistenciaBuraco} = require('./buracoController')


const recebimentoReport =  async (req, res) => {

    const {tipo, idDispositivo, descricao, localizacao, status, criticidade, confirmacoes} = req.body

    

    if(!tipo || !idDispositivo || !descricao|| !localizacao|| !status || !criticidade||!confirmacoes) {


        res.json({Mensagem: "Erro na entrada de dados através do body"})


        if(!tipo) {
            res.status(400).json({Mensagem: 'Erro no dado tipo'})
        }else

        if(!idDispositivo) {
            res.status(400).json({Mensagem:'Erro no dado idDispositivo'})
        }

        else

        if(!descricao) {
            res.status(400).json({Mensagem:'Erro no dado descricao'})
        }else

        if(!localizacao) {
            res.status(400).json({Mensagem:'Erro no dado localizacao'})
        }
        else

        if(!status) {
            res.status(400).json({Mensagem:'Erro no dado status'})
        }else

        if(!criticidade) {
            res.status(400).json({Mensagem:'Erro no dado criticidade'})
        }
        else
        if(!confirmacoes) {
            res.status(400).json({Mensagem:'Erro no dado confirmacoes'})
        }

    }else
    {

        const validacaoExistencia = await verificarExistenciaBuraco(tipo, idDispositivo, descricao, localizacao, status, criticidade, confirmacoes)
        
        if(validacaoExistencia.buracoExistente == true){
            res.json(validacaoExistencia)
        }else
        if(validacaoExistencia.buracoExistente == false){
            res.json(validacaoExistencia)
        }
    
    }

}

module.exports = {recebimentoReport}