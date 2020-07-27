// const ROSLIB = require('roslib');
const ROS_NAMESPACE = '/ubiquityrobot/'

class ros_client {
  constructor(ros_base_ip, btnHandler = null) {
    this.url = 'ws://' + ros_base_ip + ':9090'
    this.ip = ros_base_ip
    this.btnListener = null
    this.sensorStatusListener = null
    this.btnHandler = btnHandler
    this.sensorStatusHandler = null
    this.ros = null
    this.setSensorStatusHandler = this.setSensorStatusHandler.bind(this)
    // this.conectToRos()
  }

  conectToRos(onConnected, onFail) {
    console.log('trying to conect to ros server:')
    try {
      var ros = new ROSLIB.Ros({
        url: this.url
      });
    } catch (e) {
      console.log('ros client init error:', e)
      return
      console.log('trying to reconect after 3 seconds')
      setTimeout(() => {
        this.conectToRos(onConnected, onFail)
      }, 3000)
      return
    }
    if (this.btnListener != null) {
      this.btnListener.unsubscribe();
    }
    var btnListener = new ROSLIB.Topic({
      ros: ros,
      name: '/ubiquityrobot/pi_driver_node/button_event',
      messageType: 'pi_driver/ButtonEvent'
    });

    ros.on('connection', () => {
      console.log('Connected to websocket server.');
      if (this.btnHandler) {
        btnListener.subscribe(this.btnHandler);
      }
      if (onConnected) {
        onConnected()
      }
    });

    ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
      if (onFail) {
        onFail()
      }
    });

    ros.on('close', () => {
      console.log('Connection to websocket server closed.');
      return
      console.log('Connection to websocket server closed. retrying after 3 seconds');
      setTimeout(() => {
        this.conectToRos(callback)
      }, 3000)
    });

    this.ros = ros
    this.btnListener = btnListener
  }
  isConnected() {
    return this.ros && this.ros.isConnected
  }
  close() {
    this.ros.close()
  }

  setSensorStatusHandler(handler) {
    console.log('set sensorStatusHandler', handler)
    this.sensorStatusHandler = handler
  }

  subSensorStatusChange(callback) {
    if (this.sensorStatusListener != null) {
      this.sensorStatusListener.unsubscribe();
    }
    var sensorStatusListener = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'pi_driver_node/sensor_status_change',
      messageType: 'pi_driver/SensorStatusChange'
    });
    if (callback) {
      sensorStatusListener.subscribe(callback);
    }
    this.sensorStatusListener = sensorStatusListener
  }

  defaultSensorStatusHandler(message) {
    console.log(message, this.sensorStatusHandler)
    if (this.sensorStatusHandler) {
      console.log('this.sensorStatusHandler')
      this.sensorStatusHandler(message)
    }
  }
  motorSetType(port, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_type',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: value
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  motorSetState(port, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_state',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: value
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }

  motorSetEnable(port, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_enable',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: value
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  motorGetEncoder(port) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_get_position',
        serviceType: 'pi_driver/GetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result.value)
      });
    })
  }
  getMotorsInfo(port) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motors_get_info',
        serviceType: 'pi_driver/GetMotorsInfo'
      });

      var request = new ROSLIB.ServiceRequest();

      client.callService(request, (result) => {
        // console.log(result)
        resolve(result.motors)
      });
    })
  }
  motorSetPulse(port, speed) {
    var topic = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'pi_driver_node/motor_set_pulse',
      messageType: 'pi_driver/U8Int32'
    });

    var msg = new ROSLIB.Message({
      port: port,
      value: speed
    });
    topic.publish(msg);
  }
  motorSetAngle(port, speed) {
    var topic = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'pi_driver_node/motor_set_angle',
      messageType: 'pi_driver/U8Int32'
    });

    var msg = new ROSLIB.Message({
      port: port,
      value: speed
    });
    topic.publish(msg);
  }

  motorSetSpeed(port, speed) {
    var topic = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'pi_driver_node/motor_set_speed',
      messageType: 'pi_driver/U8Int32'
    });

    var msg = new ROSLIB.Message({
      port: port,
      value: speed
    });
    topic.publish(msg);
    /*
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_speed',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: speed
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
    */
  }

  motorSetPosition(port, position) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_position',
        serviceType: 'pi_driver/MotorSetPosition'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: position
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  motorSetCurrentPosition(port, position) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_current_position',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: position
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  motorSetRotate(port, position) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_rotate',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: position
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  nineAxisSetEnable(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/9axes_set_enable',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: 0x46,
        value: value
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  get3AxesData(id) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_3axes',
        serviceType: 'pi_driver/SensorGet3Axes'
      });

      var request = new ROSLIB.ServiceRequest({
        id: id
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  getSensorType(port) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_type',
        serviceType: 'pi_driver/GetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port
      });

      client.callService(request, (result) => {
        // console.log(result)
        resolve(result.value)
      });
    })
  }

  getSensorValue(port) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_value',
        serviceType: 'pi_driver/GetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result.value)
      });
    })
  }

  getSensorInfo(port) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_info',
        serviceType: 'pi_driver/GetSensorInfo'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port
      });

      client.callService(request, (result) => {
        // console.log(result)
        resolve(result)
      });
    })
  }

  getPowerState() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/get_power_state',
        serviceType: 'pi_driver/GetPowerState'
      });

      var request = new ROSLIB.ServiceRequest();

      client.callService(request, (result) => {
        // console.log(result)
        resolve(result)
      });
    })
  }

  detectAprilTag() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'apriltag_detector_node/detect_apriltag',
        serviceType: 'pi_cam/GetApriltagDetections'
      });

      var request = new ROSLIB.ServiceRequest();

      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  /*
    detectLanePose() {
      return new Promise((resolve) => {
        var client = new ROSLIB.Service({
          ros: this.ros,
          name: ROS_NAMESPACE + 'lane_detector_node/get_lane_pose',
          serviceType: 'duckietown_msgs/GetLanePose'
        });

        var request = new ROSLIB.ServiceRequest();

        client.callService(request, (result) => {
          console.log(result)

          resolve(result)
        });
      })
    }
  */
  cameraSetEnable(value, id = 0) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/camera_set_enable',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: id,
        value: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }

  cameraSetRectify(value, id = 0) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/camera_set_rectify',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: id,
        value: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve("设置成功")
      });
    })
  }

  cameraSetFlip(value, id = 0) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/camera_set_flip',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: id,
        value: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve("设置成功")
      });
    })
  }
  setNS(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/set_ns',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  createCat(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/create_cat',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  deleteNS(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/delete_ns',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  deleteCat(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/delete_cat',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  listNS() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/list_ns',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest({ data: '' });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  listCat() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/list_cat',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest({ data: '' });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  saveFrame(data) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/camera_save_frame',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: data
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  trainClassifier(data = '3') {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/train_classifier',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: data
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  getPredictions() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/predict',
        serviceType: 'pi_driver/GetPredictions'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  getTrainingData() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/get_training_data',
        serviceType: 'pi_driver/GetPredictions'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  subTraningLogs(callback) {
    var listener = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'transfer_learning_node/training_logs',
      messageType: 'std_msgs/String'
    });

    listener.subscribe((message) => {
      console.log('Received message on ' + listener.name + ': ', message);
      if (callback) {
        callback(message)
      } else {
        console.log(message)
      }
    });
  }
  setTransferSize(w = 224, h = 224) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'transfer_learning_node/set_size',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ port: w, value: h });
      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }

  getFaceLabels() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'face_recognizer_node/list_face_labels',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  detectFaceLocations() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'face_recognizer_node/detect_face_locations',
        serviceType: 'pi_cam/GetFaceDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  detectFaceLabels() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'face_recognizer_node/detect_face_labels',
        serviceType: 'pi_cam/GetFaceDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  addFaceLabel(label) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'face_recognizer_node/add_face_label',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: label
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  removeFaceLabel(label) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'face_recognizer_node/remove_face_label',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: label
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  detectColor(params) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'line_detector_node/detect_line',
        serviceType: 'pi_cam/GetLineDetection'
      });

      var request = new ROSLIB.ServiceRequest(params);
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  setColorThreshold(params) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'line_detector_node/set_color_threshold',
        serviceType: 'pi_cam/SetColorThreshold'
      });

      var request = new ROSLIB.ServiceRequest(params);
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.res)
      });
    })
  }

  getColorThreshold(color) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'line_detector_node/get_color_threshold',
        serviceType: 'pi_cam/GetColorThreshold'
      });

      var request = new ROSLIB.ServiceRequest({
        color: color
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.res)
      });
    })
  }
  getColorList(params) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'line_detector_node/get_color_list',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest(params);
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  subLineDetection(callback) {
    var listener = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'line_detector_node/line_detection',
      messageType: 'pi_cam/LineDetection'
    });

    listener.subscribe((message) => {
      console.log('Received message on ' + listener.name + ': ', message);
      if (callback) {
        callback(message)
      } else {
        console.log(message)
      }
    });
  }

  getImageTopics() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/get_image_topics',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  /*
  setPidEnable(enabled = 1, speed = 50, offset = 240, factor = 1.0) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'line_detector_node/pid_set_enable',
        serviceType: 'pi_driver/SetPid'
      });

      var request = new ROSLIB.ServiceRequest({
        enabled: enabled,
        speed: speed,
        offset: offset,
        factor: factor
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  */
  subJoyState(callback) {
    var listener = new ROSLIB.Topic({
      ros: this.ros,
      name: ROS_NAMESPACE + 'joystick_node/joy_state',
      messageType: 'std_msgs/String'
    });

    listener.subscribe((message) => {
      // console.log('Received message on ' + listener.name + ': ', message);
      if (callback) {
        callback(message)
      } else {
        console.log(message)
      }
    });
  }
  getAliveNodes() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_master_node/get_alive_nodes',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  shutdownNode(node_name) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_master_node/shutdown_node',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: node_name
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  launchNode(node_name) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_master_node/launch_node',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: node_name
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  launchTerminal(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_master_node/launch_terminal',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: 0,
        value: value
      });
      console.log(client, request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.value)
      });
    })
  }

  /*
  inputString(input) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/input_string',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: input
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  */

  variableList() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/variable_list',
        serviceType: 'pi_driver/GetString'
      });

      var request = new ROSLIB.ServiceRequest({
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }

  getServosInfo(ids = []) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servos_get_info',
        serviceType: 'pi_driver/GetServosInfo'
      });

      var request = new ROSLIB.ServiceRequest({
        ids: ids
      });
      // console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.servos)
      });
    })
  }

  setServoPosition(id, position, ms = 0, speed = 0) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servo_set_position',
        serviceType: 'pi_driver/SetServoPosition'
      });

      var request = new ROSLIB.ServiceRequest({
        id, position, ms, speed
      });
      console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.status)
      });
    })
  }

  setServoParamU8(id, param_id, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servo_set_u8',
        serviceType: 'pi_driver/SetServoParam'
      });

      var request = new ROSLIB.ServiceRequest({
        id, param_id, value
      });
      console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.status)
      });
    })
  }
  setServoParamU16(id, param_id, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servo_set_u16',
        serviceType: 'pi_driver/SetServoParam'
      });

      var request = new ROSLIB.ServiceRequest({
        id, param_id, value
      });
      console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.status)
      });
    })
  }
  getServoParamU8(id, param_id, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servo_get_u8',
        serviceType: 'pi_driver/SetServoParam'
      });

      var request = new ROSLIB.ServiceRequest({
        id, param_id, value
      });
      console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.status)
      });
    })
  }
  getServoParamU16(id, param_id, value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/servo_get_u16',
        serviceType: 'pi_driver/SetServoParam'
      });

      var request = new ROSLIB.ServiceRequest({
        id, param_id, value
      });
      console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.status)
      });
    })
  }
  getSensorsInfo() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensors_get_info',
        serviceType: 'pi_driver/GetMotorsInfo'
      });

      var request = new ROSLIB.ServiceRequest();
      // console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.motors)
      });
    })
  }
  getObjectDetections() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'object_detector_node/detect_object',
        serviceType: 'pi_cam/GetObjectDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      // console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  setObjectDetectionThreshold(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'object_detector_node/set_threshold',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ value: value });
      // console.log(request)
      client.callService(request, (result) => {
        resolve(result)
      });
    })
  }
  getImageClassify() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'image_classifier_node/class_image',
        serviceType: 'pi_cam/GetObjectDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      // console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  setImageClassifyThreshold(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'image_classifier_node/set_threshold',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ value: value });
      // console.log(request)
      client.callService(request, (result) => {
        resolve(result)
      });
    })
  }

  setClassifySize(w = 224, h = 224) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'image_classifier_node/set_size',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ port: w, value: h });
      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  getUltraFaceInference() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'ultra_face_inference_node/detect_face_locations',
        serviceType: 'pi_cam/GetFaceDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      // console.log(request)
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }
  setUltraFaceThreshold(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'ultra_face_inference_node/set_threshold',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ value: value });
      // console.log(request)
      client.callService(request, (result) => {
        resolve(result)
      });
    })
  }

  setUltraFaceResize(w = 160, h = 120) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'ultra_face_inference_node/set_resize',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({ port: w, value: h });
      client.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }

  subCompressedImage(topic, callback) {
    var listener = new ROSLIB.Topic({
      ros: this.ros,
      name: topic,
      // name: '/ubiquityrobot/camera_node/image_raw/compressed',
      messageType: 'sensor_msgs/CompressedImage'
    });

    listener.subscribe(callback);
    return listener
  }

  listCaliFiles() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/list_cali_file',
        serviceType: 'pi_driver/GetStrings'
      });

      var request = new ROSLIB.ServiceRequest({
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  loadCaliFile(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'camera_node/load_cali_file',
        serviceType: 'pi_driver/SetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: value
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }

  recognizeText(lang = 'eng') {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'text_recognizer_node/detect_text',
        serviceType: 'pi_driver/GetString'
      });

      var request = new ROSLIB.ServiceRequest({
        data: lang
      });
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

  setTextRoi(value) {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'text_recognizer_node/set_roi',
        serviceType: 'pi_cam/SetRoi'
      });

      var request = new ROSLIB.ServiceRequest(value);
      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }

  detectBarcode() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'barcode_scanner_node/barcode_scan',
        serviceType: 'pi_cam/GetObjectDetections'
      });

      var request = new ROSLIB.ServiceRequest();
      client.callService(request, (result) => {
        console.log(result)
        resolve(result)
      });
    })
  }

}

// module.exports = ros_client
