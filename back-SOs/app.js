// Importa bibliotecas essenciais
var createError = require('http-errors'); // Para lidar com erros HTTP
var express = require('express'); // Framework para construir o servidor
var path = require('path'); // Módulo para manipular caminhos de diretórios
var cookieParser = require('cookie-parser'); // Para lidar com cookies
var logger = require('morgan'); // Middleware de log das requisições

// Importa rotas do projeto
const systemCallRouter = require('./routes/SystemCallRoutes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/UserRoutes');
var authRouter = require('./routes/AuthRoutes');
var notesRouter = require('./routes/NotesRoutes');

const cors = require('cors'); // Middleware para habilitar o CORS (acesso entre domínios)

// Conecta ao banco de dados MongoDB
var connectDB = require('./config/db');
connectDB(); // Executa a conexão

// Cria a aplicação Express
var app = express();

// Habilita o uso de CORS na aplicação
app.use(cors());

// Configura a view engine (opcional; pode ser removido se não for usar views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares padrão do Express
app.use(logger('dev')); // Loga requisições no console
app.use(express.json()); // Permite receber JSON no corpo das requisições
app.use(express.urlencoded({ extended: false })); // Permite receber dados de formulários
app.use(cookieParser()); // Permite manipular cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta "public"

// Define as rotas da aplicação
app.use('/users', usersRouter); // Rota para /users
app.use('/api/systemcalls', systemCallRouter); // Rota para chamadas de sistema
app.use('/', indexRouter); // Rota raiz da API
app.use('/api/users', usersRouter); // Rota duplicada, mas com prefixo /api
app.use('/api/auth', authRouter); // Rota para autenticação (login e cadastro)
app.use('/api/notes', notesRouter); // Rota para as notas dos usuários

// Middleware para capturar rotas inexistentes (erro 404)
app.use(function(req, res, next) {
  next(createError(404));
});

// Middleware para lidar com erros da aplicação
app.use(function(err, req, res, next) {
  // Define variáveis locais para exibir mensagens de erro
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Define o status e renderiza uma página de erro
  res.status(err.status || 500);
  res.render('error');
});

// Exporta a aplicação para ser utilizada pelo servidor (ex: bin/www)
module.exports = app;
