const {retornarNomeRua} = require('../../util/processarOverpass')
const {buscarRua} = require('../controllers/ruaController')
const buracoModel = require('../models/buracoModel');


const adicionarReportBuraco = async (idDispositivo, descricao, localizacao, criticidade  ) => {

    const nomeRua =  await retornarNomeRua(localizacao.coordinates[0], localizacao.coordinates[1]) // GABRIEL CUIDADO COM A ORDEM DE ENVIO DOS DADOS DE LOCALIZAÇÃO,  PARA API DO NOMINATIM TEM QUE SER LAT/LONG
    const idRua = await buscarRua(nomeRua)
    
    

    if(nomeRua && idRua){

        const newLocalizacao = {

            rua: nomeRua,
            ruaID: idRua,
            type: "Point",
            coordinates: localizacao.coordinates

        }

        
            const novoReport = new buracoModel({

            idDispositivo: idDispositivo,
            localizacao: newLocalizacao,
            criticidade: criticidade
        })

        if(descricao){
            novoReport.descricao = descricao
        }


        const reportAdicionado = await novoReport.save()
        

        if(reportAdicionado) {

            return {reportAdicionado: true}

        }else{
            
            return {reportAdicionado: false}
        }


    }

}

const aumentarConfirmacao = async (obj) => {

    try {
        const reportAtualizado = await buracoModel.findOneAndUpdate(

            { _id: obj._id }, { $inc: { confirmacoes: 1 } }, { new: true }
        );
        
        if(reportAtualizado) {

            
            return {confirmacaoAtualizado: true, confirmacoes: reportAtualizado.confirmacoes}

        }else
        {
            return {confirmacaoAtualizado: false}
        }
    }
    catch (error) {

        console.error('Erro ao aumentar confirmações:', error);
        
    }

}

const verificarExistenciaBuraco = async (localizacao) => {

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
                    $maxDistance: 5
                }
            }
        });

        if(buracoExistente){

            const val = await aumentarConfirmacao(buracoExistente)
            
        
            return {buracoExistente: true, confirmacoes: val }
            
        }
        else
        {
            return {buracoExistente: false  }
        }

    }

    catch (error) {
        console.error('Erro ao verificar existência do buraco:', error);
        throw error;
    } 
}


module.exports = {adicionarReportBuraco, aumentarConfirmacao, verificarExistenciaBuraco}
