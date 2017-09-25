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

		if (err) return res.status(500).json({ error: err })

		res.status(200).json({ uploaded: true })

	})

	form.on('fileBegin', function (name, file) {

		const [fileName, fileExt] = file.name.split('.')

		file.path = path.join(uploadDir, `${md5(fileName)}_${new Date().getTime()}.${fileExt}`)

	})
});

module.exports = router;
