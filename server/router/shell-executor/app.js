const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.returnValue = 'pong'
})

function createWindow(file_path) {
  let win = new BrowserWindow({
    width: 240,
    height: 320,
    // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
    // frame: false, //remove menubar and control
    webPreferences: {
      nodeIntegration: true
    }
  })
  if (file_path) {
    win.loadURL(`file://${__dirname}/index.html?path=${file_path}`)
    // win.loadFile('index.html')
  } else {
    win.loadURL(`file://${__dirname}/index.html`)
  }
}

app.on('ready', () => {
  createWindow("/home/hao/Programs/Python/hello.py")
})