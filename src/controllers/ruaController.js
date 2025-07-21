import ruaModel from '../models/ruaModel.js';
import buracoModel from '../models/buracoModel.js';

import { RuasOverpass, retornarNomeRua } from '../../util/processarOverpass.js';
import { buscarCidade } from '../controllers/cidadeController.js';



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

const retornarRua = async (req, res) => {
    try {

        const buracos = await buracoModel.find();
        const ruas = await ruaModel.find();

        const ruasComBuracos = [];

        for (const rua of ruas) {
            
            const temBuraco = buracos.some(buraco => 
                String(rua._id) === String(buraco.localizacao.ruaID)
            );

           
            if (temBuraco && !ruasComBuracos.find(r => String(r._id) === String(rua._id))) {
                ruasComBuracos.push(rua);
            }
        }

        res.json(ruasComBuracos); 
        
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar ruas com buracos", detalhes: error.message });
    }
};


const alterarBuracosPorRua = async (req, res) => {
    

    try{

        const {ruaId} = req.body

        const resultado = await buracoModel.updateMany({"localizacao.ruaID": ruaId}, { $set: {status:"Fechado"}})
        console.log(resultado)

        res.status(200).json(resultado)

    }
    catch(error){
        
        console.log(error)
    }

}


export { addRua, buscarRua, retornarRua, alterarBuracosPorRua };





