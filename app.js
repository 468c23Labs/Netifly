var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/music', function(req, res) {
  return res.render('music', { artists: getSongList() });
});

app.get('/', function(req, res) {
  return res.render('home');
});

app.get('/music/song/:id', function(req, res) {
  return res.render('music-player', { song: getSongDetails(req.params.id) });
});

function getSongList() {
  return [
    getSongDetails(0)
  ];
}

function getSongDetails(id) {
  return [{
    artist: 'Above & Beyond',
    title: 'Hello (Album Mix)',
    url: '/songue.mp3'
  }][id];
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

require('http').createServer(app).listen(process.env['HTTP_PORT'], function() {
  if (process.env['STOP_ON_READY']) {
    process.kill(process.pid, 'SIGSTOP');
  }
});
