// 'use strict';

// const debuglog = require('util').debuglog('lepi_gui')
const debuglog = console.log
const {
  createServer
} = require('http');
//const WebSocket = require('ws');
const os = require('os');

const mdns = require('./router/mdns')
const {
  checkCameraConnection,
  startPiDriver,
  startDuckService,
  resetAll
} = require('./router/system')
const env = require('../env')

var {
  runScratch,
  hideScratchWindow,
  closeScratchWindow,
  showScratchWindow,
  sendKeyMessage
} = require('./router/scratch-runner/index')
const app = require('./server')

var mainWindow = null

const btnState = {

}

function onBtnEvent(message) {
  // console.log('Received message on ' + listener.name + ': ', message);
  // console.log(message)
  // listener.unsubscribe();

  if (message.value && message.type) {
    btnState[message.value] = message.type
  }

  if (mainWindow == null) {
    console.log('mainWindow == null')
    return
  }
  // # Exit 'E' 69
  if (message.value == 69) {
    resetAll()
  }

  if (message.value == 66 && message.type == 4) {
    mainWindow.focus()
  }
  if (mainWindow.focused) {

    mainWindow.webContents.send('key-event', message);
    /*
    if (message.value == 82 && scratchWindow != null) { // R Run
      console.log('focus scratchWindow')
      showScratchWindow()
    }
    */
  } else {
    if (message.value == 66) { // B Back
      hideScratchWindow()
      mainWindow.focus()
    } else {
      // console.log('send to scratchWindow')
      sendKeyMessage(message)
    }
  }
}

const RosClient = require('./router/ros')
const ros = new RosClient(env.ros_base_url, onBtnEvent)

app.get('/hide_scratch_window', (req, res) => {
  hideScratchWindow()
  res.send('hide scratch window ok')
  console.log(mainWindow.focused)
  mainWindow.focus()
  console.log(mainWindow.focused)
})

app.get('/close_scratch_window', (req, res) => {
  closeScratchWindow()
  res.send('close scratch window ok')
  mainWindow.focus()
})

app.get('/show_scratch_window', (req, res) => {
  showScratchWindow()
  res.send('show_scratch_window')
})

app.get('/run_scratch', (req, res) => {
  console.log(req.query)
  if (req.query && req.query.file_path) {
    runScratch(req.query.file_path)
  }
  res.json({
    "status": "ok"
  })
})

const server = createServer(app);

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

global.ros = ros

function createWindow() {

  globalShortcut.register('ESC', () => {
    mainWindow.setFullScreen(false);
  })

  mainWindow = new BrowserWindow({
    width: 240,
    height: 320,
    // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
    frame: false, //remove menubar and control
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.on('blur', () => {
    console.log('mainWindow blured')
    mainWindow.focused = false
  })

  mainWindow.on('focus', () => {
    console.log('mainWindow focused')
    mainWindow.focused = true
  })
  mainWindow.on('show', () => {
    console.log('mainWindow showed')
  })
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load')
    if (os.platform() === 'linux') {
      mdns.start_mdns_server()
      checkCameraConnection().then(connected => {
        if (connected) {
          console.log('camera connected , start duck service')
          startDuckService()
        } else {
          console.log('camera not connected , start pi driver')
          startPiDriver()
        }
      })
    }
  })
  // mainWindow.loadFile('../build/index.html')
  // mainWindow.loadURL(`file://${__dirname}/scratch-runner/app.html`)
  // mainWindow.loadURL('http://localhost:8000/index')
  mainWindow.loadURL(env.index_base_url)
  //mainWindow.loadURL('http://localhost:3000')
  mainWindow.setFullScreen(true);
  console.log(mainWindow)
}



electron.app.on('ready', () => {
  server.listen(8000, () => {
    debuglog('Listening on http://localhost:8000');
    ros.conectToRos(() => {
      console.log('connected to ros')
    })
    createWindow()

    // createScratchWindow()
  });
})