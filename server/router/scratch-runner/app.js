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

function createWindow() {
  let win = new BrowserWindow({
    width: 240,
    height: 320,
    // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
    // frame: false, //remove menubar and control
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile('app.html')
  // win.loadURL('http://localhost:8073/playground/index.html')

}

app.on('ready', createWindow)