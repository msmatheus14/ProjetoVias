const mongoose = require('mongoose');

const ruaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  bairro: {
    type: String,
    required: false,
    trim: true,
    uppercase: true,
  },
  cidadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cidade',
    required: true,
  },
  geometria: {
    type: {
      type: String,
      enum: ['LineString'],
      required: true
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  }
}, {
  timestamps: true,
});

ruaSchema.index({ geometria: '2dsphere' });

const Rua = mongoose.model('Rua', ruaSchema);

module.exports = Rua;
