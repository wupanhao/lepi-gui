const express = require('express');
// const fs = require('fs');
const path = require('path');
const os = require('os')
const ChildProcess = require('child_process');

const router = express.Router();

const save_dir = path.join(os.homedir(), 'Lepi_Data')
const save_file = path.join(save_dir, '.variable.yaml')

const ns = '/variable'

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

router.get('/set', function (req, res) {
    const name = req.query['name']
    if (name == undefined) {
        res.json({ code: -2, msg: '变量名未提供' })
        return
    }
    const value = req.query['value']
    if (value == undefined) {
        res.json({ code: -3, msg: '变量值未提供' })
        return
    }
    try {
        PromisifyExec(`rosparam set ${ns}/${name} ${value}`).then(out => {
            res.json({ code: 0, msg: '设置成功' })
            ChildProcess.execSync('rosparam dump ' + save_file + ' /variable')
        })
    } catch (error) {
        res.json({ code: -1, msg: '设置失败' })
    }
})

router.get('/delete', function (req, res) {
    const name = req.query['name']
    if (name == undefined) {
        res.json({ code: -2, msg: '变量名未提供' })
        return
    }
    try {
        PromisifyExec(`rosparam delete ${ns}/${name} `).then(out => {
            res.json({ code: 0, msg: '删除成功' })
            ChildProcess.execSync('rosparam dump ' + save_file + ' /variable')
        })
    } catch (error) {
        res.json({ code: -1, msg: '删除失败' })
    }
})

router.get('/save', function (req, res) {
    try {
        PromisifyExec('rosparam dump ' + path.join(save_dir, '.variable.yaml') + ' /variable').then(out => {
            res.json({ code: 0, msg: '保存成功' })
        })
    } catch (error) {
        res.json({ code: -1, msg: '保存失败' })
    }
})

module.exports = router