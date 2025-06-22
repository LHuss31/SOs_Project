// Importa o Express e cria um roteador separado
const express = require('express');
const router = express.Router();

// Importa bcrypt para criptografar senhas e jwt para autenticação via token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Modelo do usuário no banco de dados
const User = require('../Models/User');

// Schemas de validação (usualmente feitos com Joi)
const { registerSchema, loginSchema } = require('../validation/userSchemas');

// Rota de cadastro de usuário
router.post('/cadastro', async (req, res) => {
    // Loga o corpo recebido para debug
    console.log('Body recebido:', req.body);

    // Valida os dados usando o schema de cadastro
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Dados inválidos!', error: error.details });
    }

    // Extrai email e senha do corpo da requisição
    const { email, senha } = req.body;

    try {
        // Criptografa a senha com bcrypt (salt de 10)
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Cria um novo usuário com a senha já criptografada
        const newUser = new User({ email, senha: hashedPassword });

        // Salva o usuário no banco de dados
        await newUser.save();

        // Gera um token JWT com id do usuário
        const token = jwt.sign(
            { _id: usuario._id }, // renomeia para _id direto
            process.env.JWT_SECRET, // chave secreta vinda do .env
            { expiresIn: "3h" } // tempo de expiração do token
        );

        // Retorna sucesso com o ID e token
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: newUser._id, token });
    } catch (error) {
        // Em caso de erro, retorna status 500
        console.error(error);
        res.status(500).json({ message: "Erro ao criar usuário!", error: error.message });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    // Valida os dados de entrada
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Dados inválidos!', error: error.details });
    }

    // Extrai email e senha do corpo
    const { email, senha } = req.body;

    try {
        // Procura o usuário no banco pelo e-mail
        const user = await User.findOne({ email });

        // Se o usuário não existir, retorna erro
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        // Compara a senha fornecida com o hash salvo
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta!' });
        }

        // Gera o token JWT com ID do usuário
        const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        // Retorna sucesso com o token
        res.json({ message: `Usuário logado com sucesso`, token });
    } catch (error) {
        // Em caso de erro interno
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer o login', error: error.message });
    }
});

// Exporta o roteador para uso no app principal
module.exports = router;
