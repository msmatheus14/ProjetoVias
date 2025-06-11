const buracoModel = require('../models/buracoModel');


const adicionarReportBuraco = async (tipo, idDispositivo, descricao, localizacao, status, criticidade, confirmacaoes  ) => {


    const novoReport = new buracoModel({
        tipo: tipo,
        idDispositivo: idDispositivo,
        descricao: descricao,
        localizacao: localizacao,
        status: status,
        criticidade: criticidade,
        confirmacoes: confirmacaoes
    })

    const reportAdicionado = await novoReport.save()
    

    if(reportAdicionado) {

        return {validacao:true, report:reportAdicionado}

    }else{
        
        return {validacao:false, report: null}
    }



}

const aumentarConfirmacao = async (obj) => {

    try {
        const reportAtualizado = await buracoModel.findOneAndUpdate(

            { _id: obj._id }, { $inc: { confirmacoes: 1 } }, { new: true }
        );
        
        if(reportAtualizado) {

            return {confirmacaoAtualizado: true}

        }else
        {
            return {confirmacaoAtualizado: false}
        }
    }
    catch (error) {

        console.error('Erro ao aumentar confirmações:', error);
        
    }

}

const verificarExistenciaBuraco = async (tipo, idDispositivo, descricao, localizacao, status, criticidade, confirmacoes) => {

    //Gabriel a ideia aqui guerreiro é que após receber os dados do body e antes de inserir um burco no banco
    // Ele verifique através dos dados de localização de existe um buraco dentro de um raio de 10m, 
    // caso ele exista guerreiro ele não vai adicionar no banco mas vai incrementar uma variavel confirmacaoes 
    // e consequenctemente isso vai aumentar a criticade do buraco no dashnboard

    try{
        const buracoExistente = await buracoModel.findOne({
            localizacao: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: localizacao.coordinates
                    },
                    $maxDistance: 15
                }
            }
        });

        if(buracoExistente){

            const val = aumentarConfirmacao(buracoExistente)
            
            return {buracoExistente: true, reportExistent: buracoExistente, confirmacao: val
            }

            
        }
        else
        {

            const reportAdicionado = await adicionarReportBuraco(tipo, idDispositivo, descricao, localizacao, status, criticidade, confirmacoes)

            return {buracoExistente: false, reportAdicionado: reportAdicionado}

        }


    }

    catch (error) {
        console.error('Erro ao verificar existência do buraco:', error);
        throw error;
    } 
}


module.exports = {adicionarReportBuraco, aumentarConfirmacao, verificarExistenciaBuraco}
