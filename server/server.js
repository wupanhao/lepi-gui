const express = require('express')
const path = require('path');
const axios = require('axios');
const fs = require('fs')

const {
  createServer
} = require('http');

const wifiRouter = require('./router/wifi')
const uploadRouter = require('./router/upload')
const fileRouter = require('./router/file-reader')
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
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next()
})
app.use('/static', express.static(path.join(__dirname, 'router/static')))
app.use('/wifi', wifiRouter)
app.use('/upload', uploadRouter)
app.use('/explore', fileRouter)
app.use('/explore', express.static(fileRouter.homedir))
app.use('/system', systemRouter)
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

app.use('/app', express.static(path.join(__dirname, '../app')));
app.get('/app', (req, res) => {
  var data = fs.readFileSync(path.join(__dirname, '../app/index.html'), {
    encoding: 'utf8'
  });
  res.send(data);
})

app.get('/clearData', (req, res) => {
  console.log('clear data')
  exec('rm -rf /home/pi/Programs/*')
  res.send({
    status: 0,
    msg: 'ok'
  });
})

const server = createServer(app)

server.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});