const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ChildProcess = require('child_process');
const router = express.Router();

// const ns = '/variable'

const prefix = `bash -c "source ${os.homedir()}/env.sh && `
// const prefix = 'docker exec -t lepi_server bash -c "source env.sh && '

const rosnodes = {
  '/ubiquityrobot/camera_node': {
    name: 'camera_node',
    text: '摄像头',
    cmd: `${prefix} roslaunch pi_cam camera_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/apriltag_detector_node': {
    name: 'apriltag_detector_node',
    text: '标签检测',
    cmd: `${prefix} roslaunch pi_cam apriltag_detector_node.launch" `,
    auto_start: true
  },
  // '/ubiquityrobot/transfer_learning_node': `${prefix} roslaunch pi_cam transfer_learning_node.launch" `,
  '/ubiquityrobot/line_detector_node': {
    name: 'line_detector_node',
    text: '颜色检测',
    cmd: `${prefix} roslaunch pi_cam line_detector_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/ultra_face_inference_node': {
    name: 'ultra_face_inference_node',
    text: '人脸检测',
    cmd: `${prefix} roslaunch pi_cam ultra_face_inference_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/face_recognizer_node': {
    name: 'face_recognizer_node',
    text: '人脸识别',
    cmd: `${prefix} roslaunch pi_cam face_recognizer_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/barcode_scanner_node': {
    name: 'barcode_scanner_node',
    text: '二维码扫描',
    cmd: `${prefix} roslaunch pi_cam barcode_scanner_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/text_recognizer_node': {
    name: 'text_recognizer_node',
    text: '文本识别',
    cmd: `${prefix} roslaunch pi_ai text_recognizer_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/image_processor_node': {
    name: 'image_processor_node',
    text: '图像处理',
    cmd: `${prefix} roslaunch pi_cam image_processor_node.launch" `,
    auto_start: true
  },
  /*
  '/ubiquityrobot/smart_audio_node': {
    name: 'smart_audio_node',
    text: '智能语音',
    cmd: `${prefix} DISPLAY=:0 roslaunch pi_ai smart_audio_node.launch" `,
    auto_start: true
  },
  */
  '/ubiquityrobot/object_detector_node': {
    name: 'object_detector_node',
    text: '目标检测',
    cmd: `${prefix} roslaunch pi_ai object_detector_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/image_classifier_node': {
    name: 'image_classifier_node',
    text: '图像分类',
    cmd: `${prefix} roslaunch pi_ai image_classifier_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/hand_detector_node': {
    name: 'hand_detector_node',
    text: '手势识别',
    cmd: `${prefix} roslaunch pi_ai hand_detector_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/pose_estimator_node': {
    name: 'pose_estimator_node',
    text: '姿态估计',
    cmd: `${prefix} roslaunch pi_ai pose_estimator_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/movenet_pose_node': {
    name: 'movenet_pose_node',
    text: '姿态估计(快速)',
    cmd: `${prefix} roslaunch pi_ai movenet_pose_node.launch" `,
    auto_start: true
  },
  '/ubiquityrobot/joystick_node': {
    name: 'joystick_node',
    text: '游戏手柄',
    cmd: `${prefix} roslaunch pi_driver joystick_node.launch" `,
    auto_start: false
  },
  '/ubiquityrobot/pupper_driver_node': {
    name: 'pupper_driver_node',
    text: '四足机器人',
    cmd: `${prefix} roslaunch pi_robot pupper_driver_node.launch" `,
    auto_start: false
  },
  '/ubiquityrobot/hexapod_driver_node': {
    name: 'hexapod_driver_node',
    text: '六足机器人',
    cmd: `${prefix} roslaunch pi_robot hexapod_driver_node.launch" `,
    auto_start: false
  },
  '/rosbridge_websocket': {
    name: 'rosbridge_websocket',
    text: 'Scratch3.0',
    cmd: `${prefix} roslaunch rosbridge_server rosbridge_websocket.launch" `,
    auto_start: true
  },
}
const availableNode = Object.keys(rosnodes)

const nodeInfo = {}
availableNode.map((nodeName, id) => {
  nodeInfo[nodeName] = {
    id: id,
    node: nodeName,
    name: rosnodes[nodeName].name,
    text: rosnodes[nodeName].text,
    status: '已停止',
    auto_start: rosnodes[nodeName].auto_start,
    process: null
  }
})

function syncRosnode() {
  try {
    let conf = {}
    availableNode.map((nodeName, id) => {
      conf[rosnodes[nodeName].name] = nodeInfo[nodeName].auto_start
    })
    fs.writeFileSync(`${os.homedir()}/Lepi_Data/.rosnode.json`, JSON.stringify(conf))
  } catch (error) {
    console.log(error)
  }
}

function getNodeInfo() {
  return Object.keys(nodeInfo).map(nodeName => {
    const item = nodeInfo[nodeName]
    // console.log(item)
    return { name: item.node, status: item.status, id: item.id, text: item.text, value: item.node, auto_start: item.auto_start }
  })
}

try {
  let str = fs.readFileSync(`${os.homedir()}/Lepi_Data/.rosnode.json`)
  let conf = JSON.parse(str)
  for (const key in nodeInfo) {
    let node = nodeInfo[key]
    if (conf[node.name] != undefined) {
      node.auto_start = conf[node.name]
    }
  }
} catch (error) {
  syncRosnode()
  console.log(error)
}

// LD_PRELOAD=/usr/lib/arm-linux-gnueabihf/libatomic.so.1 

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
  if (os.arch().indexOf('arm') < 0) {
    console.log('on PC, ignore')
    return
  }
  PromisifyExec('rosnode list').then(output => {
    console.log(output)
    if (output.indexOf('/rosbridge_websocket') >= 0) {
      console.log('节点已启动')
      return true
    }
    else {
      console.log('startPiServer')
      let cmd = "roslaunch pi_driver lepi_server.launch"
      for (const key in nodeInfo) {
        if (nodeInfo[key].auto_start) {
          cmd += ` ${nodeInfo[key].name}:=True`
        }
      }
      cmd = `${prefix} ${cmd}" > /tmp/lepi_server.log`
      console.log(cmd)
      const child = ChildProcess.spawn(cmd, {
        // const child = ChildProcess.spawn(`docker run -t -v /home/pi:/home/pi --rm --net host --privileged --name lepi_server wupanhao/lepi_driver bash -c "source ${os.homedir()}/workspace/lepi-ros-server/env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &`, {
        detached: true,
        stdio: 'ignore',
        shell: true
      })
      child.unref()

      child.on('exit', (code, signal) => {
        console.log(`pi_driver_node exit with: code ${code}, signal: ${signal}, restart after 15 seconds`);
        setTimeout(startPiServer, 15000)
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
    res.json(getNodeInfo())
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
  const force = req.query['force']
  if (!nodeName) {
    res.json({ msg: '参数未提供:name', code: -1 })
    return
  }
  if (nodeInfo[nodeName]) {
    if (force && force == 'true'){
      // 强制重启
      console.log('强制重启')
    }
    else if (nodeInfo[nodeName].status != '已停止') {
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
    console.log('trying to launch node ' + nodeName, rosnodes[nodeName].cmd)
    nodeInfo[nodeName].status = '启动中'
    nodeInfo[nodeName].process = ChildProcess.spawn(rosnodes[nodeName].cmd, {
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

router.get('/enable', function (req, res) {
  const nodeName = req.query['name']
  if (!nodeName) {
    console.log({ msg: '参数未提供:name', code: -1 })
  } else if (nodeInfo[nodeName]) {
    if (nodeInfo[nodeName].auto_start == false) {
      nodeInfo[nodeName].auto_start = true
      syncRosnode()
    }
  }
  res.json(getNodeInfo())
})

router.get('/disable', function (req, res) {
  const nodeName = req.query['name']
  if (!nodeName) {
    console.log({ msg: '参数未提供:name', code: -1 })
  } else if (nodeInfo[nodeName]) {
    if (nodeInfo[nodeName].auto_start == true) {
      nodeInfo[nodeName].auto_start = false
      syncRosnode()
    }
  }
  res.json(getNodeInfo())
})

try {
  startPiServer()
} catch (error) {
  console.log(error)
}

console.log(`check pi_driver_node status after 60 seconds`);
setTimeout(startPiServer, 60000)

module.exports = router
