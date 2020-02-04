const express = require('express');
const Wifi = require('rpi-wifi-connection');
const fs = require('fs');
const path = require('path');
const multer = require('multer')
const os = require('os')

const {
	runScratch
} = require('../scratch-runner/index')

const wifi = new Wifi();

const router = express.Router();
const platform = os.platform()

var temp_dir = path.join(__dirname, '../../temp')
const save_dir = require('../scratch-runner/index').getProgramDir()

function mkdirIfNotExists(target_dir) {
	if (!fs.existsSync(target_dir)) {
		fs.mkdirSync(target_dir);
	}
}

mkdirIfNotExists(path.join(save_dir, ''))
mkdirIfNotExists(path.join(save_dir, 'Scratch'))
mkdirIfNotExists(path.join(save_dir, 'Python'))
mkdirIfNotExists(path.join(save_dir, 'Shell'))
mkdirIfNotExists(path.join(save_dir, 'Music'))
mkdirIfNotExists(temp_dir)

// watchFile(temp_dir)

const tempStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, temp_dir)
	},
	filename: function(req, file, cb) {
		// console.log(file)
		cb(null, file.originalname)
		// cb(null, Date.now() + '-' + file.originalname)
	}
})

const temp = multer({
	storage: tempStorage
});

// 单文件上传
router.post('/debug', temp.single('upload_file'), function(req, res, next) {
	var file = req.file;
	console.log(file)
	res.send({
		ret_code: '0'
	});
	runScratch(file.path)
	// mainWindow.webContents.send('loadFile', {
	//   path: file.path
	// });
});

const saveStorage = multer.diskStorage({
	destination: function(req, file, cb) {
		if (path.extname(file.originalname) == '.sb3') {
			cb(null, save_dir + '/Scratch')
		} else if (path.extname(file.originalname) == '.py') {
			cb(null, save_dir + '/Python')
		} else if (path.extname(file.originalname) == '.sh') {
			cb(null, save_dir + '/Shell')
		} else if (path.extname(file.originalname) == '.mp3') {
			cb(null, save_dir + '/Music')
		} else {
			cb(null, temp_dir)
		}
	},
	filename: function(req, file, cb) {
		// console.log(file)
		cb(null, file.originalname)
		// cb(null, Date.now() + '-' + file.originalname)
	}
})

const save = multer({
	storage: saveStorage
});

// 单文件上传
router.post('/save', save.single('upload_file'), function(req, res, next) {
	var file = req.file;
	console.log(file)
	res.send({
		ret_code: '0'
	});
});

// router.use('/program', express.static(path.join(__dirname, 'temp')));
router.get('/', function(req, res, next) {
	var form = fs.readFileSync(path.join(__dirname, 'upload.html'), {
		encoding: 'utf8'
	});
	res.send(form);
});

module.exports = router