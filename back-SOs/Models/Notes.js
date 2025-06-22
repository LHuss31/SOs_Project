// Importa o módulo mongoose para definir o schema do modelo
const mongoose = require('mongoose');

// Define o schema de uma nota
const noteSchema = new mongoose.Schema({
  // Campo de texto da nota, obrigatório
  text: { type: String, required: true },

  // Referência ao usuário que criou a nota (relacionamento com o modelo User)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

// Ativa timestamps automáticos: cria os campos createdAt e updatedAt
}, { timestamps: true });

// Exporta o modelo Note com base no schema definido
module.exports = mongoose.model('Note', noteSchema);
