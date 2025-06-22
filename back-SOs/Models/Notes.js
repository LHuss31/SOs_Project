// Importa o mongoose
const mongoose = require('mongoose');

// Define o schema (estrutura) para o modelo de nota (note)
const noteSchema = new mongoose.Schema({
  // Campo 'text' que armazena o conteúdo da nota, obrigatório
  text: { type: String, required: true },

  // Campo 'user' que referencia o usuário dono da nota
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  // Gera automaticamente os campos 'createdAt' e 'updatedAt'
  timestamps: true 
});

// Exporta o modelo 'Note' com base no schema definido
module.exports = mongoose.model('Note', noteSchema);
