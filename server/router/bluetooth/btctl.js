const { exec, execSync, spawn } = require('child_process');

class BluetoothCtl {
    constructor() {
        this.devices = []
        this.scanProcess = null
        try {
            console.log(this.getDevices(), this.getPairedDevices())
            // this.startDiscovering()
            setTimeout(() => {
                this.stopDiscovering()
                console.log(this.getDevices(), this.getPairedDevices())
            }, 10000);
        } catch (error) {
            console.log(error)
        }
    }

    getDevices() {
        const out = execSync('bluetoothctl devices').toString();
        const devs = out.trim().split('\n').filter(dev => dev && dev.length > 1)
        this.devices = devs.map(item => {
            const device = item.split(' ')
            return {
                name: device[2],
                mac: device[1]
            }
        })
        return this.devices
    }

    getPairedDevices() {
        const out = execSync('bluetoothctl paired-devices').toString();
        const devs = out.trim().split('\n').filter(dev => dev && dev.length > 1)
        this.pairedDevices = devs.map(item => {
            const device = item.split(' ')
            return {
                name: device[2],
                mac: device[1]
            }
        })
        return this.pairedDevices
    }

    deviceInfo(mac) {
        return execSync(`bluetoothctl info ${mac}`).toString().trim();
    }

    pairDevice(mac) {
        return execSync(`bluetoothctl pair ${mac}`).toString().trim();
    }
    removeDevice(mac) {
        return execSync(`bluetoothctl remove ${mac}`).toString().trim();
    }
    connectDevice(mac) {
        return execSync(`bluetoothctl connect ${mac}`).toString().trim();
    }
    disconnectDevice(mac) {
        return execSync(`bluetoothctl disconnect ${mac}`).toString().trim();
    }
    trustDevice(mac) {
        return execSync(`bluetoothctl trust ${mac}`).toString().trim();
    }
    getDeviceInfo(mac) {
        return execSync(`bluetoothctl info ${mac}`).toString().trim();
    }
    getControllerInfo() {
        return execSync(`bluetoothctl show`).toString().trim();
    }
    isScanning() {
        const out = execSync('bluetoothctl show').toString();
        if (out.indexOf('Discovering: no') != -1) {
            return false
        } else if (out.indexOf('Discovering: yes') != -1) {
            return true
        } else {
            console.log('unknown scanning state')
            return false
        }
    }
    restartService() {
        const out = execSync('sudo service bluetooth restart');
        console.log('restart bluetooth service', out)
    }
    startDiscovering() {
        if (this.isScanning()) {
            console.log('scanning in process')
        } else {
            console.log('startDiscovering')
            this.scanProcess = spawn('bluetoothctl scan on', { shell: true })
        }
    }
    stopDiscovering() {
        console.log('stopDiscovering')
        if (this.scanProcess && !this.scanProcess.killed) {
            this.scanProcess.kill()
        }
    }
}

module.exports = BluetoothCtl

// const btctl = new BluetoothCtl()

// setTimeout(() => {
//     console.log(btctl.process.stdout.read());
// }, 15000)