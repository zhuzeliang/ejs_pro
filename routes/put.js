var express = require('express');
var router = express.Router();
router.post('/', function(req, res, next) {
	res.send('respond with a resource');
    var title = req.body.title;
    var auther = req.body.auther;
    var content = req.body.content;
    if(title){
       console.log(title)
       console.log(auther)
       console.log(content)
    }
});
module.exports = router;
