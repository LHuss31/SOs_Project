// Importa o módulo mongoose para definir o schema do modelo
const mongoose = require('mongoose');

// Define o schema de um usuário com os campos e suas validações
const userSchema = new mongoose.Schema({
  // Campo de e-mail, obrigatório e único (não pode haver dois iguais no banco)
  email: { type: String, required: true, unique: true },
  
  // Campo de senha, obrigatório
  senha: { type: String, required: true },
  
// Ativa timestamps automáticos: cria os campos createdAt e updatedAt
}, { timestamps: true });

// Exporta o modelo User com base no schema definido
module.exports = mongoose.model('User', userSchema);
