const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

var mainWindow = null

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

function createWindow(file_path = null) {
  let win = new BrowserWindow({
    width: 1280,
    height: 720,
    // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
    // frame: false, //remove menubar and control
    webPreferences: {
      nodeIntegration: true
    }
  })
  // win.loadFile('app.html')
  if (file_path) {
    win.loadURL(`file://${__dirname}/app.html?path=${file_path}`)
  } else {
    win.loadURL(`file://${__dirname}/app.html`)
  }
  mainWindow = win
  // win.loadURL('http://localhost:8073/playground/index.html')
}

const fs = require('fs');
const express = require('express');
const multer = require('multer')
const path = require('path')
const os = require('os')
const platform = os.platform()
const server = express();
var temp_dir = os.tmpdir()
var save_dir = '/home/pi/Programs'

if (platform === 'win32') {
  save_dir = path.join(__dirname, 'temp')
}

if (!fs.existsSync(save_dir)) {
  fs.mkdirSync(save_dir);
}

fs.watch(save_dir, (event, filename) => {
  var file_path = path.join(save_dir, filename)
  console.log(filename, event, fs.existsSync(file_path))
  if (event == 'rename' && fs.existsSync(file_path)) {
    if (mainWindow != null) {
      mainWindow.webContents.send('loadFile', {
        path: file_path
      });
    } else {
      createWindow()
    }
  }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, save_dir)
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage
});

// 单文件上传
server.post('/upload', upload.single('upload_file'), function(req, res, next) {
  var file = req.file;
  console.log(file)
  res.send({
    ret_code: '0'
  });

  // mainWindow.webContents.send('loadFile', {
  //   path: file.path
  // });

});

server.use('/program', express.static(path.join(__dirname, 'temp')));

server.get('/upload', function(req, res, next) {
  var form = fs.readFileSync('./upload.html', {
    encoding: 'utf8'
  });
  res.send(form);
});

app.on('ready', () => {
  server.listen(3000, () => {
    console.log('server started at port 3000')
    createWindow()
  });
})

// module.exports = server