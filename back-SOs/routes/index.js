// Importa o módulo express para criar rotas
var express = require('express');

// Cria um roteador do Express
var router = express.Router();

// Define a rota GET raiz "/" da API
// Quando acessada, retorna um JSON simples com uma mensagem
router.get('/', function(req, res) {
  res.json({ message: 'API funcionando!' });
});

// Exporta o roteador para ser usado em outros arquivos
module.exports = router;
