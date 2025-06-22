// Importa o mongoose para conectar ao MongoDB
const mongoose = require('mongoose');
// Importa o dotenv para carregar variáveis de ambiente do arquivo .env
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do .env para process.env
dotenv.config();

// Função assíncrona que realiza a conexão com o banco de dados MongoDB
const connectDB = async () => {
  try {
    // Tenta conectar ao banco de dados usando a URL definida na variável de ambiente DATABASE_URL
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,        // Usa o novo parser de URL do MongoDB
      useUnifiedTopology: true,     // Usa a nova engine de monitoramento de servidores
    });

    // Exibe mensagem no console em caso de conexão bem-sucedida
    console.log(`Banco de dados conectado: ${conn.connection.host}`);
  } catch (error) {
    // Em caso de erro na conexão, exibe mensagem de erro e encerra o processo com falha
    console.error(`Erro ao conectar ao banco de dados: ${error.message}`);
    process.exit(1); 
  }
};

// Exporta a função para que possa ser usada em outras partes da aplicação
module.exports = connectDB;
