const express = require('express')
const path = require('path');
const axios = require('axios');
const fs = require('fs')

const bodyParser = require('body-parser');
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })

const {
  createServer
} = require('http');

const mdns = require('./router/mdns')
const wifiRouter = require('./router/wifi')
const uploadRouter = require('./router/upload')
const fileRouter = require('./router/file-reader')
const rosRouter = require('./router/ros')
const variableRouter = require('./router/variable')
const scratchRouter = require('./router/scratch-cloud')
// const bluetoothRouter = require('./router/bluetooth')

const {
  systemRouter,
} = require('./router/system')

// const data_dir = require('./router/scratch-runner/index').getProgramDir()
const exec = require('child_process').exec;
/*
const wss = new WebSocket.Server({
  server
});
wss.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  debuglog('client with ip %s connected.', ip)
  ws.on('close', function() {
    debuglog('client with ip %s disconnected.', ip)
  });

  ws.on('message', function incoming(data) {
    debuglog(data);
    if (!(data && data.type)) {
      ws.send(JSON.stringify(Ret.Fail("data type invalid")))
      return
    }
  });
});
*/

const app = express()
// app.use('/scratch-runner', express.static(path.join(__dirname, 'scratch-runner')));
// app.use('/wifi', express.static(__dirname + '/wifi'));
app.use('/', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, x-token");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    next()

  }
})

app.get('/test', (req, res) => {
  res.send('ok');
})

app.use('/static', express.static(path.join(__dirname, 'router/static')))
app.use('/wifi', wifiRouter)

try {
  const serialRouter = require('./router/serial')
  app.use('/serial', serialRouter)
} catch (error) {
  console.log(error)
}
// app.use('/bluetooth', bluetoothRouter)
app.use('/upload', uploadRouter)
app.use('/explore', fileRouter)
app.use('/explore', express.static(fileRouter.homedir))
app.use('/rosNode', rosRouter)
app.use('/variable', variableRouter)
app.use('/system', systemRouter)
app.use('/scratch', jsonParser)
app.use('/scratch', scratchRouter)
app.get('/stream_list', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  axios.get('http://localhost:8080/').then(result => {
    // console.log(result)
    // console.log(result.data)
    if (result && result.data) {
      res.send(result.data)
    } else {
      res.send('error')
    }
  })
})
app.get('/proxy', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.query.method == 'POST') {
    axios.post(req.query.url).then(result => {
      // console.log(result)
      // console.log(result.data)
      if (result && result.data) {
        res.send(result.data)
      } else {
        res.send('error')
      }
    }).catch(error => {
      console.log('error', error)
      res.send('error')
    })
  } else {
    axios.get(req.query.url).then(result => {
      // console.log(result)
      // console.log(result.data)
      if (result && result.data) {
        res.send(result.data)
      } else {
        res.send('error')
      }
    }).catch(error => {
      console.log('error', error)
      res.send('error')
    })
  }
})


app.use('/app', express.static(path.join(__dirname, '../app')));
app.get('/app', (req, res) => {
  var data = fs.readFileSync(path.join(__dirname, '../app/index.html'), {
    encoding: 'utf8'
  });
  res.send(data);
})

const server = createServer(app)

try {
  const electron = require('electron')
  const BrowserWindow = electron.BrowserWindow
  const globalShortcut = electron.globalShortcut
  function createWindow() {

    /*
    globalShortcut.register('ESC', () => {
      mainWindow.setFullScreen(false);
    })
    */

    mainWindow = new BrowserWindow({
      width: 240,
      height: 320,
      // autoHideMenuBar: true, //remove menubar but save minimize maxmize controls
      frame: false, //remove menubar and control
      webPreferences: {
        nodeIntegration: false
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

    mainWindow.loadURL("http://localhost:8000/app")
    //mainWindow.loadURL('http://localhost:3000')
    mainWindow.setFullScreen(true);
    console.log(mainWindow)
  }
  electron.app.commandLine.appendSwitch("--disable-http-cache");
  electron.app.on('ready', () => {
    server.listen(8000, () => {
      console.log('Listening on http://localhost:8000 with electron');
      createWindow()
    })
  })
  mdns.start_mdns_server()
}
catch (error) {
  console.log(error)
  server.listen(8000, () => {
    console.log('Listening on http://localhost:8000');
    /*
        chromium-browser http://localhost:8000/app --window-size=240,320 \
        --kiosk \
        --noerrdialogs \
        --disable-session-crashed-bubble \
        --disable-infobars \
        --check-for-update-interval=604800 \
        --disable-pinch
    */
    /*
     exec('chromium-browser --app=http://localhost:8000/app --window-size=240,320 --window-position=0,0 --kiosk --noerrdialogs' +
       ' --disable-session-crashed-bubble --disable-infobars --check-for-update-interval=604800 --disable-pinch', (err, stdout, stderr) => {
         console.log(err, stdout, stderr)
       })
       */
  })
}
