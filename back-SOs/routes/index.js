// filepath: c:\Users\lucas\Documents\SOs_Project\back-SOs\routes\index.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'API funcionando!' });
});

module.exports = router;