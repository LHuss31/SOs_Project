const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { registerSchema, loginSchema } = require('../validation/userSchemas');

router.post('/cadastro', async (req, res) => {
     console.log('Body recebido:', req.body);
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Dados inválidos!', error: error.details });
    }

    // Pegue nome, email e senha do body
    const { email, senha } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = new User({ email, senha: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { _id: usuario._id }, // renomeia para _id direto
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
          );

        res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: newUser._id, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar usuário!", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Dados inválidos!', error: error.details });
    }

    const { email, senha } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta!' });
        }

        const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ message: `Usuário logado com sucesso`, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer o login', error: error.message });
    }
});

module.exports = router;