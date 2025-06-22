// Importa o mongoose
const mongoose = require('mongoose');

// Define o schema para o modelo de usuário
const userSchema = new mongoose.Schema({
  // Campo de e-mail, obrigatório e único
  email: { type: String, required: true, unique: true },

  // Campo de senha, obrigatório
  senha: { type: String, required: true },
}, { 
  // Adiciona automaticamente createdAt e updatedAt
  timestamps: true 
});

// Exporta o modelo 'User' com base no schema
module.exports = mongoose.model('User', userSchema);
