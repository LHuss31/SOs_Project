const express = require('express');
const router = express.Router();
const Note = require('../Models/Notes');
const verifyToken = require('../middlewares/verifyToken'); // Adicione isso

// Criar uma nova nota (rota protegida)
router.post('/', verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Texto da nota é obrigatório.' });
  }
  try {
    const note = new Note({ text, user: req.user._id }); // Associar o usuário aqui
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar nota', error: error.message });
  }
});

// Listar todas as notas do usuário logado (rota protegida)
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 }); // Apenas as do usuário
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notas', error: error.message });
  }
});

// Deletar uma nota (rota protegida)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Garante que o usuário só apague suas próprias notas
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(403).json({ message: 'Nota não encontrada ou não pertence a você.' });
    }
    res.json({ message: 'Nota deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar nota', error: error.message });
  }
});

module.exports = router;
