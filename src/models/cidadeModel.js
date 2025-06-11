const mongoose = require('mongoose');

const cidadeSchema = new mongoose.Schema({

  nome: {

    type: String,
    required: true,
    trim: true,
    uppercase: true,  
  },

  estado: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },

  pais: {
    type: String,
    required: true,
    default: 'BRASIL',
    uppercase: true,
    trim: true,
  }

})

const modelCidade = mongoose.model('Cidade', cidadeSchema)

module.exports = modelCidade
