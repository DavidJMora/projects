const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
let mongoose = require('mongoose');


// Mongoose database
mongoose.connect('mongodb://localhost/api-users', {useNewUrlParser: true}, function(err) {
  if(err) {
    console.log(`Error:  ${err}`);
  } else {
    console.log("Mongodb connected");
  }
})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

let app = express();

app.use(expressValidator({
  errorFormatter: function(param, message, value) {
    let namespace = param.split('.');
    let root = namespace.shift();
    let formParams = root

    while(namespace.length) {
      formParams += '[' + namespace.shift() + ']'
    }

    return {
      param: formParams,
      message: message,
      value: value
    }
  }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('super-secret'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
