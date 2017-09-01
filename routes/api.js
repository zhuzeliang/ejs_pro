var express = require('express');
var router = express.Router();
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
router.get('/', function(req, res, next) {
    res.json({"a":1,"b":2});
    
});
router.get('/login', function(req, res, next) {
    res.json({"a":1,"b":2});
});
module.exports = router;
