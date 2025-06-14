const ruaModel = require('../models/ruaModel')

const {RuasOverpass, retornarNomeRua} = require('../../util/processarOverpass');
const {buscarCidade} = require('../controllers/cidadeController');


const addRua = async (req, res) => {


    const nomeRuas = await RuasOverpass();

    const idCidade = await buscarCidade('Nova Andradina');

    if(!idCidade) {
        res.status(404).json({mensage:"Cidade não encontrada"})
    }

    for (const nome of nomeRuas.ruas) {

    

            const obj = new ruaModel({ nome:nome, cidadeId:idCidade });
             await obj.save();
            
}

const ruas = await ruaModel.find()

res.json(ruas)

  
};

const buscarRua = async (nome) => {

    const rua = await ruaModel.findOne({nome: new RegExp(`^${nome}$`, 'i')})

    if(rua){
        
        return rua._id.toString()

    }else
    {
        return false
    }

}





module.exports = { addRua, buscarRua};
