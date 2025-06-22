const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Verifica se o cabeçalho de autorização está presente
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou mal formatado." });
  }

  // Extrai o token removendo o prefixo "Bearer "
  const token = authHeader.split(" ")[1];

  // Verifica o token com a chave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    // Salva os dados do usuário extraídos do token para uso posterior
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
