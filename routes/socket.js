var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
// var http = require('http').Server(express);
// var io = require('socket.io')(http);

/* GET users listing. */
router.get('/', function(req, res, next) {
    // io.on('connection', function(socket) {
    //     socket.emit('news', { hello: 'world' });
    //     socket.on('my other event', function(data) {
    //         console.log(data);
    //     });
    // });
    res.render('socket');
});
router.prepareSocketIO = function (server) {
	var io = socket_io.listen(server);
    io.sockets.on('connection', function (socket) {

        socket.on('join', function (user) {
            socket.user = user;
            socket.emit('state', 'SERVER', true);
            socket.broadcast.emit('state', 'SERVER', user + '上线了');
        });
        socket.on('sendMSG', function (msg) {
            socket.emit('chat', socket.user, msg);
            socket.broadcast.emit('chat', socket.user, msg);
        });

    });
}

module.exports = router;