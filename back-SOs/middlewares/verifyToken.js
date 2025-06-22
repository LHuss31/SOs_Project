const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido ou formato inválido." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    console.log("Decoded JWT:", decoded);
    // aqui, assumimos que o nome do campo é userID, não _id
    req.user = { _id: decoded.userID };
    next();
  });
};

module.exports = verifyToken;
