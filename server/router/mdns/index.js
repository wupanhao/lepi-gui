const mdns = require('multicast-dns')()
const os = require('os');

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

  // console.log('local ip address:', getLocalIps());
  mdns.on('query', query => {
    if (query.questions[0] && query.questions[0].name === HOSTNAME) {
      console.log('got a query packet:', query)
      var ips = getLocalIps()
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
}

module.exports = {
  getLocalIps: getLocalIps,
  start_mdns_server: start_mdns_server
}
