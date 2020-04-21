const express = require('express');
const path = require('path');
const os = require('os')
const ChildProcess = require('child_process');

const SerialPort = require('./serial')

const router = express.Router();

const devices = {}

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

router.get('/connect', function (req, res) {
    const name = req.query['name']
    if (name == undefined) {
        res.json({ code: -2, msg: '设备名未提供' })
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

router.get('/release', function (req, res) {
    const name = req.query['name']
    const device = devices[name]
    if(!device){
        res.json({ code: -2, msg: '设备未连接' })
        return
    }
    try {
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

module.exports = router