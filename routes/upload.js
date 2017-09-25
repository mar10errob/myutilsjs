var express = require('express');
var router = express.Router();
var path = require('path');
var md5 = require('md5');
var formidable = require('formidable');
var uploadDir = path.join(__dirname, '/..', '/public/uploads/');


/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('upload', {});

});

router.post('/', function(req, res) {

	var form = new formidable.IncomingForm();

	form.multiples = true
	form.keepExtensions = true
	form.uploadDir = uploadDir

	form.parse(req, (err, fields, files) => {

		var file_name = files.file.path.replace(uploadDir,"");

		console.log("parse", file_name)

		if (err) return res.status(500).json({ error: err })

		res.status(200).json({ uploaded: true, url: "http://localhost:3000/uploads/" + file_name })

	})

	form.on('fileBegin', function (name, file) {

		const [fileName, fileExt] = file.name.split('.')

		let nameFile = `${md5(fileName)}_${new Date().getTime()}.${fileExt}`;

		file.path = path.join(uploadDir, nameFile)
	})

	form.on('file', function(name, file) {
		console.log("onFile", file.name);
	});
});

router.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/../images/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});

module.exports = router;
