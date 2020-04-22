const serialport = require("serialport");

class SerialPort{
  constructor(dev = "/dev/rfcomm0",option = {baudRate: 9600}){
    this.device = new serialport(dev,option)
    this.isOpen = false
    this.device.on('open',() => {
      this.isOpen = true
      console.log('open ',dev,'success')
    })
  }

  writeAndDrain (data,callback) {
    this.device.write(data,  () => {
      this.device.drain(callback);
    });
  }

  static listDevices(){
    return serialport.list()
  }

  readString(count){
    var buf 
    if(count > 0){
      buf = this.device.read(count)
    }else{
      buf = this.device.read()
    }
    if(buf)
      return buf.toString()
    else{
      return ''
    }
  }

  close(){
    try {
      if(this.isOpen)
        this.device.close()
    } catch (error) {
      console.log(error)
    }
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

SerialPort.listDevices().then(console.log)