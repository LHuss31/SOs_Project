const express = require('express');
const router = express.Router();
const Note = require('../Models/Notes');

// Criar uma nova nota
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Texto da nota é obrigatório.' });
  }
  try {
    const note = new Note({ text });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar nota', error: error.message });
  }
});

// Listar todas as notas
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar notas', error: error.message });
  }
});

// Deletar uma nota
router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Nota deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar nota', error: error.message });
  }
});

module.exports = router;