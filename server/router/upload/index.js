const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer')
const os = require('os')

const router = express.Router();

const save_dir = path.join(os.homedir(), 'Lepi_Data')
const temp_dir = os.tmpdir()

function mkdirIfNotExists(target_dir) {
    if (!fs.existsSync(target_dir)) {
        fs.mkdirSync(target_dir);
    }
}

function createDirectory() {
    mkdirIfNotExists(path.join(save_dir, ''))
    mkdirIfNotExists(path.join(save_dir, 'Scratch'))
    mkdirIfNotExists(path.join(save_dir, 'Python'))
    mkdirIfNotExists(path.join(save_dir, 'Shell'))
    mkdirIfNotExists(path.join(save_dir, 'Music'))
    mkdirIfNotExists(path.join(save_dir, 'Photo'))
    mkdirIfNotExists(path.join(save_dir, 'Recording'))
    mkdirIfNotExists(path.join(save_dir, 'nes'))
    mkdirIfNotExists(path.join(save_dir, 'ros/smart_audio_node/'))
}

createDirectory()

// watchFile(temp_dir)


router.get('/clearData', (req, res) => {
    console.log('clear data')
    exec(`mv ${save_dir}/Scratch ${save_dir}/Python ${save_dir}/Shell ${save_dir}/Music ${save_dir}/Photo ${save_dir}/Recording /tmp`)
    createDirectory()
    res.send({
        status: 0,
        msg: 'ok'
    });
})

router.get('/restoreData', (req, res) => {
    console.log('restore data')
    exec(`mv /tmp/Scratch /tmp/Python /tmp/Shell /tmp/Music /tmp/Photo /tmp/Recording  ${save_dir}`)
    res.send({
        status: 0,
        msg: 'ok'
    });
})

const tempStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, temp_dir)
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, file.originalname)
        // cb(null, Date.now() + '-' + file.originalname)
    }
})

const temp = multer({
    storage: tempStorage
});

// 单文件上传
router.post('/debug', temp.single('upload_file'), function (req, res, next) {
    var file = req.file;
    console.log(file)
    res.send({
        ret_code: '0'
    });
    // runScratch(file.path)
    // mainWindow.webContents.send('loadFile', {
    //   path: file.path
    // });
});

const saveStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (path.extname(file.originalname) == '.sb3') {
            cb(null, path.join(save_dir, 'Scratch'))
        } else if (path.extname(file.originalname) == '.py') {
            cb(null, path.join(save_dir, 'Python'))
        } else if (path.extname(file.originalname) == '.sh') {
            cb(null, path.join(save_dir, 'Shell'))
        } else if (path.extname(file.originalname) == '.mp3') {
            cb(null, path.join(save_dir, 'Music'))
        } else if (path.extname(file.originalname) == '.png') {
            cb(null, path.join(save_dir, 'Photo'))
        } else if (path.extname(file.originalname) == '.wav' || path.extname(file.originalname) == '.oga') {
            cb(null, path.join(save_dir, 'Recording'))
        } else if (path.extname(file.originalname) == '.nes-save') {
            cb(null, path.join(save_dir, 'nes'))
		} else if (path.extname(file.originalname) == '.bnf') {
			cb(null, path.join(save_dir, 'ros/smart_audio_node/'))
		} else {
            cb(null, temp_dir)
        }
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, file.originalname)
        // cb(null, Date.now() + '-' + file.originalname)
    }
})

const save = multer({
    storage: saveStorage
});

// 单文件上传
router.post('/save', save.single('upload_file'), function (req, res, next) {
    var file = req.file;
    console.log(file)
    res.send({
        ret_code: '0'
    });
});

// router.use('/program', express.static(path.join(__dirname, 'temp')));
router.get('/', function (req, res, next) {
    var form = fs.readFileSync(path.join(__dirname, 'upload.html'), {
        encoding: 'utf8'
    });
    res.send(form);
});

module.exports = router