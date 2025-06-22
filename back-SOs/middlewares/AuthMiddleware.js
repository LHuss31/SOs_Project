const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ error: "Token não fornecido." });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token inválido." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido ou expirado." });

    req.user = user; // aqui você armazena o objeto com _id, email, etc.
    next();
  });
};

module.exports = verifyToken;
