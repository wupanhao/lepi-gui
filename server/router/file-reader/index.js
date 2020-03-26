const express = require('express');

const router = express.Router();

const fs = require('fs')
const path = require('path')

const os = require('os')

const homedir = path.join(os.homedir(), 'Lepi_Data')
router.homedir = homedir
console.log(homedir)
router.get('/', function (req, res) {
	console.log(req.query)
	var dir = req.query['dir'] || homedir

	if (!fs.existsSync(dir) || fs.statSync(dir).isFile()) {
		dir = homedir
	}

	fs.readdir(dir, function (err, files) {
		var result = { files: [], dirs: [], current: dir, homedir: homedir }
		if (err) {
			console.warn(err)
			res.json(result)
		} else {
			try {
				files.map(file => {
					full_path = path.join(dir, file)
					if (fs.statSync(full_path).isFile()) {
						result.files.push(file)
					} else {
						result.dirs.push(file)
					}
				})
			} catch (error) {
				console.log(err)
			}
			res.json(result)

		}
	})
})

module.exports = router