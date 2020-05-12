'usestrict';

const ChildProcess = require('child_process');
const debuglog = console.log

function PromisifyExec(cmd) {
    return new Promise(resolve => {
        console.log('run cmd:', cmd)
        ChildProcess.exec(cmd, (error, stdout, stderr) => {
            if (error || stderr) {
                console.log(error, stderr)
            }
            if (stdout) {
                resolve(stdout.trim())
            } else {
                resolve()
            }
        })
    })
}

class AudioControl {
    constructor() {
        const out = ChildProcess.execSync('aplay -l | grep wm8960').toString()
        this.cid = out[5]
        console.log(out, this.cid)
        this.devices = {
            hdmi: {
                min: -10239,
                max: 400,
                cid: 0,
                numid: 1
            },
            speaker: {
                min: 0,
                max: 127,
                cid: this.cid,
                numid: 13
            },
            headphone: {
                min: 0,
                max: 127,
                cid: this.cid,
                numid: 11
            },
            microphone: {
                min: 0,
                max: 63,
                cid: this.cid,
                numid: 1
            }
        }
    }
    get(iface) {
        return new Promise((resolve) => {
            const device = this.devices[iface]
            if (!device) {
                console.log('no such device ' + iface)
                return
            }
            const cmd = `amixer cget -c ${device.cid} numid=${device.numid}`
            PromisifyExec(cmd).then(out => {
                if (!out) {
                    return
                }
                const pattern = /: values=(.{1,7})/
                const match = out.match(pattern);
                var value = (parseInt(match[1]) - device.min) / (device.max - device.min) * 100.0
                value = Math.round(Math.pow(Math.E, (value - 5.8989) / 20.416))
                debuglog(`now value is ${value}%`)
                resolve(Math.floor(value))
            })
        })
    }

    set(iface, volume) {
        return new Promise((resolve) => {
            const device = this.devices[iface]
            if (!device) {
                console.log('no such device ' + iface)
                resolve()
                return
            }
            if (volume > 0 && volume < 100) {
                // y = 20.416lnx+5.8989
                volume = 20.416 * Math.log(volume) + 5.8989
            }
            if (volume <= 0) {
                volume = 0
            } else if (volume >= 100) {
                volume = 100
            }
            if (0 <= volume && volume <= 100) {
                const cmd = `amixer cset -c ${device.cid} numid=${device.numid} ${volume}%`
                PromisifyExec(cmd).then(out => {
                    if (!out) {
                        resolve()
                        return
                    }
                    const pattern = /: values=(.{1,7})/
                    const match = out.match(pattern);
                    var value = (parseInt(match[1]) - device.min) / (device.max - device.min) * 100.0
                    value = Math.pow(Math.E, (value - 5.8989) / 20.416)
                    debuglog(`now value is ${Math.floor(value)}%(${value})`)
                    resolve(Math.floor(value))
                })
            } else {
                resolve()
            }

        })
    }

    getAll() {
        return new Promise((resolve) => {
            const data = {}
            this.get('speaker').then(speakerVolume => {
                data.speaker = speakerVolume
                this.get('headphone').then(headphoneVolume => {
                    data.headphone = headphoneVolume
                    this.get('microphone').then(microphoneVolume => {
                        data.microphone = microphoneVolume
                        resolve(data)
                    })
                })
            })
        })
    }
}
module.exports = AudioControl