const express = require('express');
const path = require('path');
const os = require('os');
const ChildProcess = require('child_process');
const router = express.Router();

const ns = '/variable'

const prefix = `bash -c "source ${os.homedir()}/workspace/lepi-gui/env.sh && `
// const prefix = 'docker exec -t lepi_server bash -c "source env.sh && '

const launchCMD = {
  '/ubiquityrobot/camera_node': `${prefix} roslaunch pi_cam camera_node.launch" `,
  '/ubiquityrobot/joystick_node': `${prefix} roslaunch pi_driver joystick_node.launch" `,
  '/ubiquityrobot/apriltag_detector_node': `${prefix} roslaunch pi_cam apriltag_detector_node.launch" `,
  '/ubiquityrobot/transfer_learning_node': `${prefix} roslaunch pi_cam transfer_learning_node.launch" `,
  '/ubiquityrobot/line_detector_node': `${prefix} roslaunch pi_cam line_detector_node.launch" `,
  '/ubiquityrobot/object_detector_node': `${prefix} roslaunch pi_ai object_detector_node.launch" `,
  '/ubiquityrobot/image_classifier_node': `${prefix} roslaunch pi_ai image_classifier_node.launch" `,
  '/ubiquityrobot/face_recognizer_node': `${prefix} roslaunch pi_cam face_recognizer_node.launch" `,
  '/ubiquityrobot/barcode_scanner_node': `${prefix} roslaunch pi_cam barcode_scanner_node.launch" `,
  '/ubiquityrobot/text_recognizer_node': `${prefix} roslaunch pi_cam text_recognizer_node.launch" `,
  '/ubiquityrobot/ultra_face_inference_node': `${prefix} roslaunch pi_cam ultra_face_inference_node.launch" `,
  '/ubiquityrobot/hexapod_driver_node': `${prefix} roslaunch hexapod_controller hexapod_driver_node.launch" `,
}
// LD_PRELOAD=/usr/lib/arm-linux-gnueabihf/libatomic.so.1 
const nodeNameMap = {
  '/ubiquityrobot/camera_node': '摄像头',
  '/ubiquityrobot/apriltag_detector_node': '标签检测',
  // '/ubiquityrobot/transfer_learning_node': '迁移学习',
  '/ubiquityrobot/line_detector_node': '颜色检测',
  '/ubiquityrobot/object_detector_node': '目标检测',
  '/ubiquityrobot/image_classifier_node': '图像分类',
  '/ubiquityrobot/ultra_face_inference_node': '人脸检测',
  '/ubiquityrobot/face_recognizer_node': '人脸识别',
  '/ubiquityrobot/barcode_scanner_node': '二维码扫描',
  '/ubiquityrobot/text_recognizer_node': '文本识别',
  '/ubiquityrobot/joystick_node': '游戏手柄',
  '/ubiquityrobot/hexapod_driver_node': '六足机器人驱动',
}

const availableNode = Object.keys(nodeNameMap)

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
        resolve('')
      }
    })
  })
}

function startPiDriver() {
  // ChildProcess.exec(`source /home/pi/workspace/lepi-gui/ros_env.sh ; roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log`)
}

function startPiServer() {
  PromisifyExec('rosnode list').then(output => {
    if (output.indexOf('pi_driver_node') >= 0) {
      console.log('节点已启动')
      return true
    }
    else {
      console.log('startPiServer')
      const child = ChildProcess.spawn(`bash -c "source ${os.homedir()}/workspace/lepi-gui/env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &`, {
        // const child = ChildProcess.spawn(`docker run -t -v /home/pi:/home/pi --rm --net host --privileged --name lepi_server wupanhao/lepi_driver bash -c "source ${os.homedir()}/workspace/lepi-ros-server/env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &`, {
        detached: true,
        stdio: 'ignore',
        shell: true
      })
      child.unref()

      child.on('exit', (code, signal) => {
        console.log(`pi_driver_node exit with: code ${code}, signal: ${signal}, restart after 5 seconds`);
        setTimeout(startPiServer, 5000)
      });
      child.on('error', (error) => {
        console.log(`pi_driver_node error with: ${error}`);
      });

      return false
    }
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
        nodeInfo[nodeName]
      }
    })
    res.json(Object.keys(nodeInfo).map(nodeName => {
      const item = nodeInfo[nodeName]
      return { name: item.name, status: item.status, id: item.id, text: nodeNameMap[item.name], value: item.name }
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
    console.log('trying to launch node ' + nodeName, launchCMD[nodeName])
    nodeInfo[nodeName].status = '启动中'
    nodeInfo[nodeName].process = ChildProcess.spawn(launchCMD[nodeName], {
      // stdio: 'inherit',
      detached: true,
      stdio: 'ignore',
      shell: true
    })
    nodeInfo[nodeName].process.on('exit', (code, signal) => {
      console.log(`child node [${nodeName}] exit with: code ${code}, signal: ${signal}`);
      nodeInfo[nodeName].status = '已停止'
    });
    nodeInfo[nodeName].process.on('error', (error) => {
      console.log(`child node [${nodeName}] error with: ${error}`);
    });

    res.json({ msg: '正在启动节点:' + nodeName, code: 0 })
  } catch (error) {
    console.log(error)
    res.json({ msg: 'Error', code: -4 })
  }
})

router.get('/start_pi_driver', function (req, res) {
  res.json({
    status: 'ok'
  })
  startPiDriver()
})

router.get('/start_pi_server', function (req, res) {
  let started = startPiServer()
  if (started) {
    res.json({
      status: 'ok',
      msg: '已启动'
    })
  } else {
    res.json({
      status: 'ok',
      msg: '启动中'
    })
  }
})

try {
  startPiServer()
} catch (error) {
  console.log(error)
}

module.exports = router
