// Importação dos módulos necessários
const express = require('express');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const { randomUUID } = require('crypto');
const path = require('path');
const verifyToken = require('../middlewares/verifyToken'); // Middleware para verificar autenticação do usuário via JWT

const router = express.Router();

// Diretórios temporários onde os arquivos do usuário serão armazenados
const tempDir = path.resolve('./temp');
const temptxtDir = path.join(tempDir, 'temptxt');

// Garante que os diretórios "./temp" e "./temp/temptxt" existam
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
if (!fs.existsSync(temptxtDir)) {
  fs.mkdirSync(temptxtDir, { recursive: true });
}

// Rota POST protegida para execução de código C
router.post('/run', verifyToken, (req, res) => {
  const { codigo } = req.body;             // Código-fonte enviado pelo frontend
  const userId = req.user._id?.toString(); // ID do usuário autenticado

  // Verifica se o usuário está autenticado
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  const id = randomUUID(); // Gera um ID único para nomear os arquivos temporários

  // Caminhos de diretório e arquivos específicos do usuário
  const userDir = path.join(temptxtDir, userId);
  const sourcePath = path.join(userDir, `${id}.c`); // Código-fonte
  const exePath = path.join(userDir, id);           // Arquivo compilado

  // Cria a pasta do usuário se ela ainda não existir
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  // Substitui caminhos relativos para garantir que arquivos sejam lidos/gravados no diretório do usuário
  const codigoComPathCorrigido = codigo.replace(/"\.\/temptxt\/(.*?)"/g, `"${userDir}/$1"`);

  // Escreve o código C no arquivo temporário
  fs.writeFileSync(sourcePath, codigoComPathCorrigido);

  // Compila o código C usando gcc
  exec(`gcc "${sourcePath}" -o "${exePath}"`, (err, _, stderrComp) => {
    if (err) {
      // Retorna erro de compilação
      return res.json({ stdout: '', stderr: stderrComp, exitCode: 1 });
    }

    // Executa o programa compilado no diretório do usuário
    const processo = spawn(`./${id}`, { cwd: userDir });

    let stdout = '', stderr = '';

    // Captura a saída padrão e de erro
    processo.stdout.on('data', (data) => stdout += data.toString());
    processo.stderr.on('data', (data) => stderr += data.toString());

    // Ao finalizar a execução, retorna o resultado e remove os arquivos temporários
    processo.on('close', (code) => {
      res.json({ stdout, stderr, exitCode: code });

      fs.unlink(sourcePath, () => {});
      fs.unlink(exePath, () => {});
    });

    // Encerra o processo se ele demorar mais de 10 segundos (timeout)
    setTimeout(() => processo.kill('SIGKILL'), 10000);
  });
});

module.exports = router;
