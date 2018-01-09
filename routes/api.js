var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var http = require("http");
var fs = require('fs');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
router.get('/', function(req, res, next) {
    res.json({ "a": 1, "b": 2 });

});
router.get('/login', function(req, res, next) {
    res.json({ "a": 1, "b": 2 });
});

Buffer.prototype.toJSON = function() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this, 0)
  };
};
   function getMap() {
        return new Promise(function(resolve, reject) {
            http.get('http://api.map.baidu.com/place/v2/search?query=ATM%E6%9C%BA&tag=%E9%93%B6%E8%A1%8C&region=%E5%8C%97%E4%BA%AC&output=json&ak=uL2Ny92Lp07mFixLbuSDT17Sfa6KAKaO', function(res) {
                res.on('data', (d) => {
                    resolve(d);
                });
            })
        })
    }
router.get('/map', function(req, res, next) {

    getMap().then(function(data) {
        // let dataJson = JSON.parse(data);
        res.json(JSON.parse(data));
    })

});

router.post('/upload', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../tmp'); //文件保存的临时目录为当前项目下的tmp文件夹
    form.maxFieldsSize = 1 * 1024 * 1024; //用户头像大小限制为最大1M  
    form.keepExtensions = true; //使用文件的原扩展名
    form.parse(req, function(err, fields, file) {
        var filePath = '';
        // console.log(file)
        console.log(fields)
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if (file.tmpFile) {
            filePath = file.tmpFile.path;
        } else {
            for (var key in file) {
                if (file[key].path && filePath === '') {
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件移动的目录文件夹，不存在时创建目标文件夹
        var targetDir = path.join(__dirname, '../upload');
        if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            res.json({ code: -1, message: '此文件类型不允许上传' });
        } else {
            //以当前时间戳对上传文件进行重命名
            var fileName = new Date().getTime() + fileExt;
            var targetFile = path.join(targetDir, fileName);
            //移动文件
            fs.rename(filePath, targetFile, function(err) {
                if (err) {
                    console.info(err);
                    res.json({ code: -1, message: '操作失败' });
                } else {
                    //上传成功，返回文件的相对路径
                    var fileUrl = '/upload/' + fileName;
                    res.json({ code: 0, fileUrl: fileUrl });
                }
            });
        }
    });
    // console.log(req)
});
module.exports = router;