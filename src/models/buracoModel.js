const mongoose = require('mongoose');

const buracoSchema = new mongoose.Schema({

  tipo: {
    type: String,
    default: 'Buraco'
  },

  idDispositivo: {
    type: String,
    required: true
  },

  descricao: { 
    type: String, 
    maxlength: 500,
    default: 'Descrição não informada'
  },

  localizacao: {

    rua: {
      type: String,
      required: true
    },

    ruaID: {
      type: String,
      required: true
    },

    type: { 
        type: String, 
        enum: ['Point'], 
        required: true 
    },

    coordinates: { 
        type: [Number], 
        required: true 
    }
  },

  status: { 
    type: String, 
    enum: ['Aberto', 'Solucionado'],
    default: 'Aberto' 
  },

  criticidade: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },

  confirmacoes: { 
    type: Number, 
    default: 1 
  }
});

buracoSchema.index({ localizacao: '2dsphere' })

const buracoModel = mongoose.model('Buraco', buracoSchema)

module.exports = buracoModel
