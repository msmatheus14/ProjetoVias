
const {adicionarReportBuraco,  verificarExistenciaBuraco} = require('./buracoController')


const recebimentoReport =  async (req, res) => {

    const { idDispositivo, descricao, localizacao, criticidade} = req.body

    

    if( !idDispositivo || !localizacao|| !criticidade) {


        res.json({Mensagem: "Erro na entrada de dados através do body"})


        

        if(!idDispositivo) {
            res.status(400).json({Mensagem:'Erro no dado idDispositivo'})
        }

        else
        if(!localizacao) {
            res.status(400).json({Mensagem:'Erro no dado localizacao'})
        }
        else
        if(!criticidade) {
            res.status(400).json({Mensagem:'Erro no dado criticidade'})
        }

    }else
    {



        const validacaoExistencia = await verificarExistenciaBuraco(localizacao)
        
        if(validacaoExistencia.buracoExistente == true){

            res.json(validacaoExistencia)

        }else

        if(validacaoExistencia.buracoExistente == false){

            const reportAdicionado = await adicionarReportBuraco(idDispositivo, descricao, localizacao, criticidade)

            if(reportAdicionado){

                res.status(201).json({buracoExistente: false, reportAdicionado: true})
            }

    
    }

}
}

module.exports = {recebimentoReport}