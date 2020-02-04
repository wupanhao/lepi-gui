const express = require('express');

const router = express.Router();

const recursive = require("recursive-readdir");

const dir = require('../scratch-runner/index').getProgramDir()
console.log(dir)
router.get('/', function(req, res) {
	recursive(dir, function(err, files) {
		if (err) {
			console.log(err)
			res.jsonp([])
			return
		}
		res.jsonp(files);
	});
})

module.exports = router