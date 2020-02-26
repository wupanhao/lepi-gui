const express = require('express');
const path = require('path');
const os = require('os');
const ChildProcess = require('child_process');
const router = express.Router();


const prefix = 'docker exec -it lepi_server bash -c '

const launchCMD = {
  '/ubiquityrobot/camera_node': `${prefix} "source env.sh && roslaunch pi_cam camera_node.launch"`,
  '/ubiquityrobot/apriltag_detector_node': `${prefix} "source env.sh && roslaunch pi_cam apriltag_detector_node.launch"`,
  '/ubiquityrobot/transfer_learning_node': `${prefix} "source env.sh && roslaunch pi_cam transfer_learning_node.launch"`,
  '/ubiquityrobot/line_detector_node': `${prefix} "source env.sh && roslaunch pi_cam line_detector_node.launch"`,
  '/ubiquityrobot/face_recognizer_node': `${prefix} "source env.sh && roslaunch pi_cam face_recognizer_node.launch"`,
  '/ubiquityrobot/joystick_node': `${prefix} "source env.sh && roslaunch pi_driver joystick_node.launch"`,
}
const availableNode = Object.keys(launchCMD)

const nodeInfo = {}
availableNode.map((nodeName, id) => {
  nodeInfo[nodeName] = {
    id: id,
    name: nodeName,
    status: '已停止',
    process: null
  }
})

function PromisifyExec(cmd) {
  return new Promise(resolve => {
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

router.get('/status', function (req, res) {
  PromisifyExec('rosnode list').then(output => {
    var nodeList = []
    if (output) {
      nodeList = output.split('\n')
    }
    nodeList.map(nodeName => {
      if (nodeInfo[nodeName]) {
        nodeInfo[nodeName].status = '已启动'
      }
    })
    res.json(Object.keys(nodeInfo).map(nodeName => {
      const item = nodeInfo[nodeName]
      return { name: item.name, status: item.status, id: item.id }
    }))
  })
})

router.get('/kill', function (req, res) {
  const nodeName = req.query['name']
  if (!nodeName) {
    res.json({ msg: '参数未提供:name', code: -1 })
    return
  }

  try {
    var buf = ChildProcess.execSync('rosnode list')
    const nodeList = String(buf).trim().split('\n')
    if (nodeList.indexOf(nodeName) == -1) {
      res.json({ msg: '节点已停止:' + nodeName, code: -2 })
      return
    }
    PromisifyExec(`rosnode kill ${nodeName}`).then(output => {
      if (output && output.search('killed') >= 0) {
        nodeInfo[nodeName].status = '已停止'
        nodeInfo[nodeName].process = null
        res.json({ msg: '已关闭节点:' + nodeName, code: 0 })
      } else {
        res.json({ msg: '关闭节点失败:' + nodeName, code: -3 })
      }
    })

  } catch (error) {
    console.log(error)
    res.json({ msg: 'Error', code: -4 })
  }
})

router.get('/launch', function (req, res) {
  const nodeName = req.query['name']
  if (!nodeName) {
    res.json({ msg: '参数未提供:name', code: -1 })
    return
  }
  if (nodeInfo[nodeName]) {
    if (nodeInfo[nodeName].status != '已停止') {
      res.json({ msg: '节点已启动:' + nodeName, code: -22 })
      return
    }
  } else {
    res.json({ msg: '不支持的节点:' + nodeName, code: -33 })
    return
  }
  try {
    /*
    var buf = ChildProcess.execSync('rosnode list')
    const nodeList = String(buf).trim().split('\n')
    if (nodeList.indexOf(nodeName) >= 0) {
      res.json({ msg: '节点已启动', code: -2 })
      return
    }
    */
    console.log('trying to launch node ' + nodeName)
    nodeInfo[nodeName].status = '启动中'
    nodeInfo[nodeName].process = ChildProcess.spawn(launchCMD[nodeName], {
      stdio: 'inherit',
      shell: true
    })
    nodeInfo[nodeName].process.on('exit', (code, signal) => {
      console.log(`child node [${nodeName}] exit with: code ${code}, signal: ${signal}`);
      nodeInfo[nodeName].status = '已停止'
    });
    res.json({ msg: '正在启动节点:' + nodeName, code: 0 })
  } catch (error) {
    console.log(error)
    res.json({ msg: 'Error', code: -4 })
  }
})

module.exports = router
