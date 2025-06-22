var express = require('express');
var router = express.Router();

// Rota GET para o caminho raiz, responde com uma mensagem simples
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
