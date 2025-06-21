const express = require('express');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const { randomUUID } = require('crypto');
const path = require('path');

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

router.post('/run', (req, res) => {
  const codigo = req.body.codigo;
  const id = randomUUID();
  const sourcePath = path.join(tempDir, `${id}.c`);
  const exePath = path.join(tempDir, id); // binário

  fs.writeFileSync(sourcePath, codigo);

  exec(`gcc "${sourcePath}" -o "${exePath}"`, (err, _, stderrComp) => {
    if (err) {
      return res.json({
        stdout: '',
        stderr: stderrComp,
        exitCode: 1
      });
    }

    // Executa o binário dentro da pasta ./temp
    const processo = spawn(`./${id}`, {
      cwd: tempDir // executa dentro de temp (então o código pode acessar ./temptxt)
    });

    let stdout = '';
    let stderr = '';

    processo.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    processo.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    processo.on('close', (code) => {
      res.json({
        stdout,
        stderr,
        exitCode: code
      });

      // Limpa os arquivos após execução
      fs.unlink(sourcePath, () => {});
      fs.unlink(exePath, () => {});
    });

    setTimeout(() => {
      processo.kill('SIGKILL');
    }, 10000);
  });
});

module.exports = router;
