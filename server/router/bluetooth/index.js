const express = require('express');
const BluetoothCtl = require('./btctl');
const bodyParser = require('body-parser')
const path = require('path');

const btctl = new BluetoothCtl();

const router = express.Router();

router.get('/devices', function (req, res) {
    const devices = btctl.getDevices()
    const pairedDevices = btctl.getPairedDevices()
    var totalDevices = {}
    devices.map(item => {
        totalDevices[item.mac] = {
            name: item.name,
            mac: item.mac,
            paired: false,
            connected: false
        }
    })

    pairedDevices.map(item => {
        const info = btctl.deviceInfo(item.mac)
        totalDevices[item.mac] = {
            name: item.name,
            mac: item.mac,
        }
        totalDevices[item.mac].paired = info.indexOf('Paired: yes') != -1
        totalDevices[item.mac].connected = info.indexOf('Connected: yes') != -1
    })

    res.json(totalDevices)
})

router.get('/connect', function (req, res) {
    const mac = req.query['mac']
    if (mac) {
        res.json({
            code: 0,
            msg: btctl.connectDevice(mac)
        })
    } else {
        res.json({
            msg: 'error',
            code: -1
        })
    }
})

router.get('/disconnect', function (req, res) {
    const mac = req.query['mac']
    if (mac) {
        res.json({
            code: 0,
            msg: btctl.disconnectDevice(mac)
        })
    } else {
        res.json({
            msg: 'error',
            code: -1
        })
    }
})

router.get('/pair', function (req, res) {
    const mac = req.query['mac']
    if (mac) {
        res.json({
            code: 0,
            msg: btctl.pairDevice(mac)
        })
    } else {
        res.json({
            msg: 'error',
            code: -1
        })
    }
})

router.get('/startScan', function (req, res) {
    btctl.startDiscovering()
    res.json({
        code: 0,
        msg: '正在扫描，请稍等'
    })
})

router.get('/stopScan', function (req, res) {
    btctl.startDiscovering()
    res.json({
        code: 0,
        msg: '扫描已停止'
    })
})

router.get('/restart', function (req, res) {
    btctl.restartService()
    res.json({
        code: 0,
        msg: '重启完成'
    })
})

module.exports = router;