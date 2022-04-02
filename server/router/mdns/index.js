const os = require('os');
const ChildProcess = require('child_process');
const mdns = require('multicast-dns')()

const HOSTNAME = 'lepi.local'

function getLocalIps() {
  var ifaces = os.networkInterfaces();
  // console.log(ifaces)
  var ips = [];
  const ignore = ['lo', 'docker0', 'uap0']

  for (var dev in ifaces) {
    if (ignore.findIndex(e => e == dev) == -1) {
      var id = ifaces[dev].findIndex(e => e.family === 'IPv4')
      if (id >= 0) {
        ips.push({
          interface: dev,
          ip: ifaces[dev][id].address
        });
      }
    }
  }
  return ips;
};

function start_mdns_server() {
  console.log('local ip address:', getLocalIps());
  mdns.on('query', query => {
    if (query.questions[0] && query.questions[0].name === HOSTNAME) {
      console.log('got a query packet:', query)
      let ips = getLocalIps()
      if (ips.length > 0) {
        console.log(ips)
        mdns.respond({
          answers: ips.map((dev) => {
            return {
              name: HOSTNAME,
              type: 'A',
              ttl: 300,
              data: dev.ip
            }
          })
        })
        /*        
            mdns.respond({
              answers: [{
                name: 'lepi-robot',
                type: 'A',
                ttl: 300,
                data: '192.168.1.5',
              }],
            })
        */

      }
    }
  })

  setInterval(() => {
    let ips = getLocalIps()
    mdns.respond({
      answers: ips.map((dev) => {
        return {
          name: HOSTNAME,
          type: 'A',
          ttl: 300,
          data: dev.ip
        }
      })
    })
  }, 3000)
}

function getMAC() {
  try {
    var out = ChildProcess.execSync('ifconfig eth0')
    var str = out.toString()
    const pattern = /ether (.{17})  /
    const match = str.match(pattern);
    if (match && match[1]) {
      // console.log(match)
      return match[1]
    }
  } catch (error) {
    console.log(error)
    return ":::::"
  }
}

function toEIRData(type, str) {
  let arr = [str.length + 1, type]
  if (typeof str == 'string') {
    for (let i = 0; i < str.length; i++) {
      arr.push(str.charCodeAt(i))
    }
  }
  else {
    arr = arr.concat(str)
  }
  return arr
}

function start_advertising() {
  try {
    const bleno = require('bleno');

    let temp = [0x02, 0x01, 0x1a]
    let name = 'lepi'
    let ips = getLocalIps()
    ips.map(dev => {
      if (dev.interface == 'wlan0' || dev.interface == 'eth0') {
        name = name + '@' + Buffer.from(dev.ip.split('.').map(str => parseInt(str))).toString('hex')
      }
    })
    temp = temp.concat(0x09, name)
    // temp = temp.concat([0x03,0x03,0x16,0x4c]) UUIDs
    // temp = temp.concat(toEIRData(0x08,'lepi')) //Complete local name
    // temp = temp.concat(toEIRData(0x09, 'lepi@' + Buffer.from([192, 168, 50, 50]).toString('hex'))) //Complete local name
    // temp = temp.concat(toEIRData(0x24,'http://')) // URI
    // temp = temp.concat(toEIRData(0xff,'jszc')) // Manufacturer Specific Data
    var advertisementData = Buffer.from(temp); // maximum 31 bytes
    var scanData = Buffer.from([]) // maximum 31 bytes

    bleno.on('stateChange', function (state) {
      console.log('on -> stateChange: ' + state);

      if (state === 'poweredOn') {
        bleno.startAdvertisingWithEIRData(advertisementData, scanData, console.log);
      } else {
        bleno.stopAdvertising();
      }
    });


    bleno.on('advertisingStart', function (error) {
      console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    });
  } catch (e) {
    console.log('advertising start error: ', e);
  }
}

// console.log(getMAC())

module.exports = {
  getLocalIps: getLocalIps,
  start_mdns_server: start_mdns_server,
  getMAC: getMAC
}
