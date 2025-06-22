// Importa o módulo jsonwebtoken para lidar com tokens JWT
const jwt = require("jsonwebtoken");

// Middleware para verificar se o token JWT enviado na requisição é válido
const verifyToken = (req, res, next) => {
  // Extrai o cabeçalho 'Authorization' da requisição
  const authHeader = req.headers["authorization"];

  // Verifica se o cabeçalho existe e se começa com 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou formato inválido." });
  }

  // Extrai o token do cabeçalho (removendo o 'Bearer ')
  const token = authHeader.split(" ")[1];

  // Verifica e decodifica o token usando a chave secreta do .env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Se o token estiver expirado ou inválido, retorna erro 403
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    // Exibe o conteúdo decodificado do token no console (útil para debug)
    console.log("Decoded JWT:", decoded);

    // Atribui o ID do usuário decodificado ao objeto req.user
    // (assumindo que o token contém o campo 'userID')
    req.user = { _id: decoded.userID };

    // Chama o próximo middleware/rota
    next();
  });
};

// Exporta o middleware para ser utilizado nas rotas protegidas
module.exports = verifyToken;
