const cidadeModel = require('../models/cidadeModel');

const addCidade = async (req, res) => {
    const { nome, estado } = req.body;
    const pais = req.body.pais || 'BRASIL'; 
    
    try {
        const cidade = new cidadeModel({ nome, estado, pais });
        await cidade.save();
        return res.status(201).json(cidade);
    }
    catch (error) {
        return res.status(500).json({ error: 'Erro ao adicionar cidade', details: error.message });
    }
}

const buscarCidade = async(nome) => {
    try {
        const cidade = await cidadeModel.findOne({nome: nome});
        if (!cidade) {
            throw new Error('Cidade não encontrada');
        }else {
            return cidade._id
        }
    }
    catch (error) {
        throw new Error('Erro ao buscar cidade: ' + error.message);
    }
}

module.exports = { addCidade, buscarCidade};