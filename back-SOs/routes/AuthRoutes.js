
// Importa o framework Express e cria um roteador
const express = require('express');
const router = express.Router();

// Importa bibliotecas para criptografia de senhas e geração de tokens JWT
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importa o modelo de usuário do banco de dados e os esquemas de validação com Joi
const User = require('../Models/User');

// Schemas de validação (usualmente feitos com Joi)
const { registerSchema, loginSchema } = require('../validation/userSchemas');


// ==================== ROTA DE CADASTRO ====================

// Define a rota POST para /cadastro
router.post('/cadastro', async (req, res) => {
    // Exibe no console os dados recebidos no corpo da requisição
    console.log('Body recebido:', req.body);

    // Valida os dados de entrada com o esquema de cadastro
    const { error } = registerSchema.validate(req.body);
    if (error) {
        // Retorna erro 400 se os dados forem inválidos
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
            { _id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        // Retorna sucesso com o ID e token
        res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: newUser._id, token });
    } catch (error) {
        // Em caso de erro, retorna status 500
        console.error(error);
        res.status(500).json({ message: "Erro ao criar usuário!", error: error.message });
    }
});

// ==================== ROTA DE LOGIN ====================

// Define a rota POST para /login
router.post('/login', async (req, res) => {
    // Valida os dados com o esquema de login

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
            // Retorna erro 404 se o usuário não for encontrado
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
        // Compara a senha fornecida com a senha criptografada do banco
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            // Retorna erro 401 se a senha estiver incorreta
            return res.status(401).json({ message: 'Senha incorreta!' });
        }
        // Gera token JWT se o login for bem-sucedido
        const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );


        // Retorna token com mensagem de sucesso
        res.json({ message: 'Usuário logado com sucesso', token });
    } catch (error) {
        // Em caso de erro, exibe no console e retorna erro 500
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer o login', error: error.message });
    }
});


// Exporta o roteador para ser usado em outras partes da aplicação

module.exports = router;
