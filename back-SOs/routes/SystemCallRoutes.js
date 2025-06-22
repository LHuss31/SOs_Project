const express = require('express');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const { randomUUID } = require('crypto');
const path = require('path');
const verifyToken = require('../middlewares/verifyToken'); // importa o middleware

const router = express.Router();
const tempDir = path.resolve('./temp');
const temptxtDir = path.join(tempDir, 'temptxt');

// Garante que as pastas ./temp e ./temp/temptxt existem
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(temptxtDir)) {
  fs.mkdirSync(temptxtDir, { recursive: true });
}

router.post('/run', verifyToken, (req, res) => {
  const { codigo } = req.body;
  const userId = req.user._id?.toString();

  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const id = randomUUID();
  const userDir = path.join(temptxtDir, userId);
  const sourcePath = path.join(userDir, `${id}.c`);
  const exePath = path.join(userDir, id);

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  // Substitui caminhos relativos para apontar para a pasta do usuário
  const codigoComPathCorrigido = codigo.replace(/"\.\/temptxt\/(.*?)"/g, `"${userDir}/$1"`);

  fs.writeFileSync(sourcePath, codigoComPathCorrigido);

  exec(`gcc "${sourcePath}" -o "${exePath}"`, (err, _, stderrComp) => {
    if (err) {
      return res.json({ stdout: '', stderr: stderrComp, exitCode: 1 });
    }

    const processo = spawn(`./${id}`, { cwd: userDir });

    let stdout = '', stderr = '';

    processo.stdout.on('data', (data) => stdout += data.toString());
    processo.stderr.on('data', (data) => stderr += data.toString());

    processo.on('close', (code) => {
      res.json({ stdout, stderr, exitCode: code });

      fs.unlink(sourcePath, () => {});
      fs.unlink(exePath, () => {});
    });

    setTimeout(() => processo.kill('SIGKILL'), 10000);
  });
});

module.exports = router;
