var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    if (name == "admin" && password == "123456") {
        res.render('login', { name: name });
    } else {
        res.send("<a href='/'>请重新登录</a>");
    }
});

module.exports = router;
