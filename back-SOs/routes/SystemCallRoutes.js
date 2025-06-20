const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const { randomUUID } = require('crypto');
const path = require('path');

const router = express.Router();

router.post('/run', (req, res) => {
  const codigo = req.body.codigo;
  const id = randomUUID();
  const sourcePath = `./temp/${id}.c`;
  const exePath = `./temp/${id}.exe`;

  fs.writeFileSync(sourcePath, codigo);

  // Compilar o código C
  exec(`gcc ${sourcePath} -o ${exePath}`, (err, _, stderrComp) => {
    if (err) {
      return res.json({
        stdout: '',
        stderr: stderrComp,
        exitCode: 1
      });
    }

    // Monta caminho absoluto compatível com Windows
    const fullExePath = path.join(__dirname, '..', exePath);

    // Executar o programa compilado
    exec(`"${fullExePath}"`, { timeout: 3000 }, (err, stdout, stderrExec) => {
      res.json({
        stdout,
        stderr: stderrExec,
        exitCode: err?.code ?? 0
      });

      // Limpar arquivos temporários
      fs.unlink(sourcePath, () => {});
      fs.unlink(exePath, () => {});
    });
  });
});

module.exports = router;
