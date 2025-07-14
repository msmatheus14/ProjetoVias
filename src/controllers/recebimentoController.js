
import { adicionarReportBuraco, verificarExistenciaBuraco } from './buracoController.js';



const recebimentoReport =  async (req, res) => {

    const { idDispositivo, latitude, longitude, descricao, criticidade} = req.body

    

    if( !idDispositivo || !latitude || !longitude || !criticidade) {


        res.json({Mensagem: "Erro na entrada de dados através do body"})


        

        if(!idDispositivo) {
            res.status(400).json({Mensagem:'Erro no dado idDispositivo'})
        }

        else
        if(!latitude) {
            res.status(400).json({Mensagem:'Erro no dado localizacao'})
        }
        else
        if(!longitude){

        res.status(400).json({Mensagem:'Erro no dado localizacao'})

        }
        else
        if(!criticidade) {
            res.status(400).json({Mensagem:'Erro no dado criticidade'})
        }

    }else
    {

         const localizacao = {

        coordinates: [latitude, longitude]

    }



        const validacaoExistencia = await verificarExistenciaBuraco(latitude, longitude)
        
        
        if(validacaoExistencia.buracoExistente == true){

            res.status(208).json(validacaoExistencia)

        }else

        if(validacaoExistencia.buracoExistente == false){

            const reportAdicionado = await adicionarReportBuraco(idDispositivo, descricao, latitude, longitude, criticidade)

            if(reportAdicionado){

                res.status(201).json({buracoExistente: false, reportAdicionado: true})
            }

    
    }

}
}

export { recebimentoReport };
