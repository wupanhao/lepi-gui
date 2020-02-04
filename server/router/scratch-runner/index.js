// const debuglog = require('util').debuglog('scratch-runner')
// const debuglog = console.log
const {
  BrowserWindow
} = require('electron')
const fs = require('fs');
const os = require('os')
const path = require('path')
const platform = os.platform()
const {
  killProcess,
  executeTerminal
} = require('../shell-executor')

var save_dir = path.join(os.homedir(), 'Programs')
var active = true

var scratchWindow = null

function getProgramDir() {
  return save_dir
}

function createScratchWindow(file_path = null) {
  scratchWindow = new BrowserWindow({
    width: 240,
    height: 320,
    // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
    frame: false, //remove menubar and control
    webPreferences: {
      nodeIntegration: true
    }
  })
  // scratchWindow.loadFile('app.html')
  if (file_path) {
    // scratchWindow.loadURL(`http://localhost:3000/scratch-runner/app.html?path=${file_path}`)
    scratchWindow.loadURL(`file://${__dirname}/app.html?path=${file_path}`)
  } else {
    // scratchWindow.loadURL(`http://localhost:3000/scratch-runner/app.html`)
    scratchWindow.loadURL(`file://${__dirname}/app.html`)
  }
  scratchWindow.setFullScreen(true);
  // scratchWindow.loadURL('http://localhost:8073/playground/index.html')
  return scratchWindow
}

function hideScratchWindow() {
  if (scratchWindow != null) {
    scratchWindow.hide()
  } else {
    console.log('scratchWindow not on , no need to hide')
  }
}

function showScratchWindow() {
  if (scratchWindow != null) {
    scratchWindow.show()
  } else {
    console.log('scratchWindow not on , cannot show')
  }
}

function closeScratchWindow() {
  if (scratchWindow != null) {
    console.log(scratchWindow)
    scratchWindow.close()
    scratchWindow = null
    /*
    const remote = require('electron').remote
    let w = remote.getCurrentWindow()
    w.close()
    */
  } else {
    console.log('scratchWindow not on')
  }
}

function runScratch(file_path) {
  if (path.extname(file_path) == '.sb3') {
    if (scratchWindow != null) {
      scratchWindow.show()
      scratchWindow.webContents.send('loadFile', {
        path: file_path
      });
    } else {
      createScratchWindow(file_path)
    }
    return scratchWindow
  } else {
    executeTerminal(file_path)
  }
  console.log("file type %s to be handled", path.extname(file_path))
}

function sendKeyMessage(message) {
  if (scratchWindow != null) {
    scratchWindow.webContents.send('key-event', message);
  }
}

function watchFile(save_dir) {
  if (!fs.existsSync(save_dir)) {
    console.log('dir ', save_dir, 'do not exist')
    return
  }
  console.log('watch dir is ', save_dir)
  fs.watch(save_dir, (event, filename) => {
    var file_path = path.join(save_dir, filename)
    console.log(filename, event, fs.existsSync(file_path))
    if (active == true && event == 'rename') {
      setTimeout(() => {
        if (fs.existsSync(file_path)) {
          active = false
          setTimeout(() => {
            active = true
          }, 1000)
          runScratch(file_path)
        }
      }, 200)
    }
  });
}

module.exports = {
  runScratch: runScratch,
  getProgramDir: getProgramDir,
  scratchWindow: scratchWindow,
  hideScratchWindow: hideScratchWindow,
  closeScratchWindow: closeScratchWindow,
  showScratchWindow: showScratchWindow,
  watchFile: watchFile,
  sendKeyMessage: sendKeyMessage
}