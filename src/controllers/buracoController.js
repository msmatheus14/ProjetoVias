const {retornarNomeRua} = require('../../util/processarOverpass')
const {buscarRua} = require('../controllers/ruaController')
const buracoModel = require('../models/buracoModel');


const adicionarReportBuraco = async (idDispositivo, descricao, latitude, longitude, criticidade  ) => {

    const nomeRua =  await retornarNomeRua(latitude, longitude) // GABRIEL CUIDADO COM A ORDEM DE ENVIO DOS DADOS DE LOCALIZAÇÃO,  PARA API DO NOMINATIM TEM QUE SER LAT/LONG
    const idRua = await buscarRua(nomeRua)
    
    console.log(nomeRua, idRua)
    

    if(nomeRua && idRua){

        const newLocalizacao = {

            rua: nomeRua,
            ruaID: idRua,
            type: "Point",
            coordinates: [latitude, longitude]

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

const verificarExistenciaBuraco = async (latitude, longitude) => {

    //Gabriel a ideia aqui guerreiro é que após receber os dados do body e antes de inserir um burco no banco
    // Ele verifique através dos dados de localização de existe um buraco dentro de um raio de 5m, 
    // caso ele exista guerreiro ele não vai adicionar no banco mas vai incrementar uma variavel confirmacaoes 
    // e consequenctemente isso vai aumentar a criticade do buraco no dashnboard

    try{
        const buracoExistente = await buracoModel.findOne({
            localizacao: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [latitude, longitude]
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

const retornarTodosBuracos = async (req, res) => {
    try{

        const buracos = await buracoModel.find()
        res.status(201).json(buracos)
    }
    catch(error){

        res.json(error)
    }
    
}

const alterarStatusBuracoPorRua = async (req, res) => {
    const {rua} = req.body;

    try {
        const buracosAtualizados = await buracoModel.updateMany(

            {"rua": rua, "status": "aberto"},
            { $set: { "status": 'fechado' } },

            res.status(200).json({message: "Buracos atualizados com sucesso!"})
        )
    }
    catch (error) {
        console.error('Erro ao atualizar buracos:', error);

        res.status(500).json({message: "Erro ao atualizar buracos"})
    }   

}


module.exports = {adicionarReportBuraco, aumentarConfirmacao, verificarExistenciaBuraco, retornarTodosBuracos, alterarStatusBuracoPorRua}
