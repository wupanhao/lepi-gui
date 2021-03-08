const AudioControl = require('./audio-control')
const ChildProcess = require('child_process');

const audio = new AudioControl()

function camera_list() {
    let buf = ChildProcess.execSync('v4l2-ctl --list-devices')
    let out = buf.toString()
    devices = out.split('\n\n')
    console.log(devices)
    for (let i = 0; i < devices.length; i++) {
        const element = devices[i];
        let device = element.split('\n\t')
        if (device.length > 0) {
            if (device[0].indexOf('Camera') > 0) {
                for (let j = 1; j < device.length; j++) {
                    const element = device[j];
                    console.log(element)
                }
            }
        }
        console.log(device)
    }
}

camera_list()