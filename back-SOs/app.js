var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');

const systemCallRouter = require('./routes/SystemCallRoutes');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/UserRoutes');
var authRouter = require('./routes/AuthRoutes');
var notesRouter = require('./routes/NotesRoutes');
const cors = require('cors');


var connectDB = require('./config/db');
connectDB();

var app = express();
app.use(cors());

// view engine setup (remova se não for usar views)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);
app.use('/api/systemcalls', systemCallRouter);
app.use('/', indexRouter);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;