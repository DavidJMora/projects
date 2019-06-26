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

let methodOverride = require('method-override');

let MongoStore = require('connect-mongo')(session);

let Category = require('./routes/product/models/Category');

require('dotenv').config();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users/users');
let productRouter = require('./routes/product/product');
let adminRouter = require('./routes/admin/admin')


mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(error => {
  console.log(`MongoDB connection error: ${error}`);
  
})

let app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({url: process.env.MONGODB_URI, autoReconnect: true}),
  cookie: {
    secure: false,
    maxAge: process.env.COOKIE_LENGTH
  }
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

require('./lib/passport/passport')(passport);




app.use(function(req, res, next) {
  res.locals.user = req.user;

  res.locals.error = req.flash('error');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.success_msg = req.flash('success_msg');

  next()
})

app.use(function(req, res, next) {
  Category.find({})
    .then(categories => {
      res.locals.categories = categories;

      next();
    })
    .catch(error => {
      return next(error)
    })

})

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

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/product', productRouter);
app.use('/api/admin', adminRouter)

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
