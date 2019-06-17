const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

require('dotenv').config();

let MongoStore = require('connect-mongo')(session)

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users/users');


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(error => {
  console.log(`MongoDB connection error: ${error}`);
  
})


let app = express();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({url: process.env.MONGODB_URI, autoReconnect: true }),
  cookie: {
    secure: false,
    maxAge: process.env.COOKIE_LENGTH
  }
}))

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

app.use(expressValidator({
  errorFormatter: function(param, message, value) {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }

    return {
      param: formParam,
      message: message,
      value: value
    }
  }
}))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
