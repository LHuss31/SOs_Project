// Importa a biblioteca Joi, usada para validação de dados
const Joi = require('joi');

// Esquema de validação para o cadastro de usuário
// Verifica se o email é válido e se a senha possui no mínimo 6 caracteres
const registerSchema = Joi.object({
  email: Joi.string().email().required(),         // Campo "email": deve ser uma string com formato de e-mail e é obrigatório
  senha: Joi.string().min(6).required()           // Campo "senha": deve ter no mínimo 6 caracteres e é obrigatório
});

// Esquema de validação para o login de usuário
// Apenas valida se os campos foram preenchidos corretamente
const loginSchema = Joi.object({
  email: Joi.string().email().required(),         // Campo "email": mesmo requisito do cadastro
  senha: Joi.string().required()                  // Campo "senha": obrigatório (sem verificação de tamanho mínimo)
});

// Exporta os esquemas para serem usados em outras partes da aplicação (ex: rotas)
module.exports = { registerSchema, loginSchema };
