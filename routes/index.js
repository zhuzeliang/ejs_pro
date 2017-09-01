"use strict";
var express = require('express');
var http = require("http");
var https = require("https");
var jsSHA = require('jssha');
var crypto = require('crypto');
var router = express.Router();
var url = require("url");
var http = require('http').Server(express);
var io = require('socket.io')(http);
var config = {
    appId: 'wx653b6205a201e1d7',
    secret: 'e2543ed127d232cd57a5592ee5cf011f'
}

router.get('/', function(req, res, next) {
    io.on('connection', function(socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function(data) {
            console.log(data);
        });
    });
    var reqData = 'http://' + req.host + req.url;

    // 获取access_token
    function getToken() {
        return new Promise(function(resolve, reject) {
            https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=wx653b6205a201e1d7&secret=e2543ed127d232cd57a5592ee5cf011f', function(res) {
                res.on('data', (d) => {
                    let access_token = JSON.parse(d).access_token;
                    resolve(access_token);
                });
            })
        })
    }
    // 获取ticket
    function getNewTicket(token) {
        return new Promise(function(resolve, reject) {
            https.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi', function(res) {
                res.on('data', (d) => {
                    let ticket = JSON.parse(d).ticket;
                    resolve(ticket);
                });
            });
        })
    }
    // 获取timestamp
    function getTimesTamp() {
        return parseInt(new Date().getTime() / 1000) + '';
    }
    // 获取noncestr
    function getNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    }
    // 获取signature
    let timestamp = getTimesTamp();
    let noncestr = getNonceStr();
    let signature, jsapi_ticket;
    getToken().then(function(data) {
        return getNewTicket(data);
    }).then(function(data) {
        let jsapi_ticket = data;
        let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + reqData;
        signature = crypto.createHash('sha1').update(str).digest('hex');
        res.render('index', { title: 'Express', noncestr: noncestr, signature: signature, timestamp: timestamp, jsapi_ticket: jsapi_ticket, req:reqData});
    });
    // var access_token = getToken();
    // var timestamp = getTimesTamp();
    // var noncestr = getNonceStr();
    // // var jsapi_ticket = getNewTicket(access_token);
    // var str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + 'http://zero.tunnel.2bdata.com';
    // var signature = crypto.createHash('sha1').update(str).digest('hex');
    // res.render('index', { title: 'Express' });
    // res.render('index', { title: 'Express',noncestr:noncestr,signature:signature,timestamp:timestamp});
});






module.exports = router;