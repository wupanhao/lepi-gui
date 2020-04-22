const express = require('express');
const path = require('path');
const os = require('os')
const ChildProcess = require('child_process');

const SerialPort = require('./serial')

const router = express.Router();

const devices = {}

var my_process = null

function PromisifyExec(cmd) {
    return new Promise(resolve => {
        console.log('PromisifyExec', cmd)
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

router.get('/bind', function (req, res) {
    const mac = req.query['mac']
    const id = req.query['id']
    if (mac == undefined || id == undefined ) {
        res.json({ code: -2, msg: 'mac或id未提供' })
        return
    }
    try {
            const out = ChildProcess.execSync(`sudo rfcomm bind ${id} ${mac}`)
            console.log(out)
            res.json({ code: 0, msg: '绑定成功' })
        } catch (error) {
            console.log(error)
            res.json({ code: -1, msg: '绑定出错' })
    }
})

router.get('/list', function (req, res) {
    SerialPort.listDevices().then(ports => {
        res.json(ports)
    })
})

router.get('/connect', function (req, res) {
    const name = req.query['name']
    if (name == undefined) {
        res.json({ code: -2, msg: '设备名未提供' })
        return
    }

    const device = devices[name]

    if(device && device.isOpen){
        res.json({ code: -1, msg: '请先断开连接' })
        return
    }

    try {
        devices[name] = new SerialPort(name)
        res.json({ code: 0, msg: '连接成功' })
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '连接失败' })
    }
})

router.get('/connected', function (req, res) {
    const name = req.query['name']
    const device = devices[name]
    if(!device){
        res.json({ code: -2, msg: '设备未连接' })
        return
    }
    try {
        if(device.isOpen)
            res.json({ code:0, msg: '设备已连接' })
        else{
            res.json({ code:-3, msg: '设备未连接' })
        }
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '操作失败',value: '' })
    }
})

router.get('/release', function (req, res) {
    const name = req.query['name']
    const device = devices[name]
    if(!device){
        res.json({ code: -2, msg: '设备未连接' })
        return
    }
    try {
        // device.close()
        const out = ChildProcess.execSync(`sudo rfcomm release ${name}`)
        devices[name] = null
        console.log(out)
        res.json({ code: 0, msg: '断开连接' })
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '操作失败' })
    }
})

router.get('/send', function (req, res) {
    const name = req.query['name']
    const data = req.query['data']
    const device = devices[name]
    if(!device){
        res.json({ code: -2, msg: '设备未连接' })
        return
    }
    try {
        device.writeAndDrain(data,() => {
            console.log('send data ',data)
            res.json({ code: 0, msg: '指令已发出' })
        })
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '操作失败' })
    }
})


router.get('/receive', function (req, res) {
    const count = req.query['count']
    const name = req.query['name']
    const device = devices[name]
    if(!device){
        res.json({ code: -2, msg: '设备未连接' })
        return
    }
    try {
        var str = device.readString(count)
        res.json({ code:0, len: str.length, value: str })
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '操作失败',value: '' })
    }
})

router.get('/startListening', function (req, res) {
	if (my_process && my_process.exitCode==null && (!my_process.killed) ) {
        res.json({ code:0, msg: '已处于监听模式，请先停止'})
		return
	}
    try {
        my_process = ChildProcess.spawn('sudo rfcomm watch hci0 > /tmp/rfcomm.log 2>&1',{shell:true})
        // my_process = ChildProcess.spawn('sudo rfcomm watch hci0',{shell:true,stdio:'inherit'})
        res.json({ code:0, msg: '已执行'})
    } catch (error) {
        console.log(error)
        res.json({ code: -1, msg: '操作失败',value: '' })
    }
})

router.get('/stopListening', function (req, res) {
    try {
        const out = ChildProcess.execSync(`sudo killall rfcomm`)
    } catch (error) {
        console.log(error)
    }

	if (my_process && !my_process.killed) {
        try {

            my_process.kill()
            res.json({ code:0, msg: '已执行'})
        } catch (error) {
            console.log(error)
            res.json({ code: -1, msg: '操作失败',value: '' })
        }
	}else{
        res.json({ code:-2, msg: '未处于监听模式'})
    }

})

module.exports = router