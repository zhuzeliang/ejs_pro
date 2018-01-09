var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var admin = require('./routes/admin');
var put = require('./routes/put');
var api = require('./routes/api');
var boom = require('./routes/boom');
var socket = require('./routes/socket');
var img = require('./routes/img');
var weui = require('./routes/weui');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/zero');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/admin', admin);
app.use('/put', put);

app.use('/api', api);
app.use('/boom', boom);
app.use('/socket', socket);
app.use('/img', img);
app.use('/weui', weui);
app.ready = function(server) {
    socket.prepareSocketIO(server);
};


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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