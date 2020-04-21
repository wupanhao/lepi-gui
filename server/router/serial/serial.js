const serialport = require("serialport");

class SerialPort{
  constructor(dev = "/dev/rfcomm0",option = {baudRate: 9600}){
    this.device = new serialport(dev,option)
  }

  writeAndDrain (data,callback) {
    this.device.write(data,  () => {
      this.device.drain(callback);
    });
  }

}

module.exports = SerialPort

/*
function callbackFun(){
  console.log('22222')
}

const sp = new SerialPort()
sp.writeAndDrain('12345',callbackFun)
*/