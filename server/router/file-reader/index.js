const express = require('express');

const router = express.Router();

const fs = require('fs')
const path = require('path')

const os = require('os')

const homedir = os.homedir()
console.log(homedir)
router.get('/', function (req, res) {
	var dir = homedir
	console.log(req.query)
	if (req.query['dir'])
		dir = path.join(homedir, req.query['dir'])
	fs.readdir(dir, function (err, files) {
		if (err) {
			console.warn(err)
		} else {
			res.json(files.map(file => {
				if (fs.statSync(path.join(dir, file)).isFile()) {
					return { file: file }
				} else {
					return { dir: file }
				}
			}))
		}
	})
})

module.exports = router