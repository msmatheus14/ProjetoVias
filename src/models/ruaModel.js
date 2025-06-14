const mongoose = require('mongoose');

const ruaSchema = new mongoose.Schema({
  
  nome: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  
  cidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cidade',
    required: true,
  },
    
} );


const Rua = mongoose.model('Rua', ruaSchema);

module.exports = Rua;
