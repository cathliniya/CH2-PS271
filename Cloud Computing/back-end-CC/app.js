require('dotenv').config();
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var translateRouter = require('./routes/translate');
var userRouter = require('./routes/user');
var translateGambarRouter = require('./routes/translateGambar');
var predictRouter = require('./routes/predict');

var app = express();

var whitelisted = process.env.WHITELISTED.split(';');

let whitelist = whitelisted;

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var message = 'The CORS policy for this origin doesn\'t ' +
        'allow access from the particular origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  },
  exposedHeaders: ['set-cookie']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/translate', translateRouter);
app.use('/user', userRouter);
app.use('/translateGambar', translateGambarRouter);
app.use('/predict', predictRouter);

module.exports = app;