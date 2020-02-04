const ROSLIB = require('roslib');
const ROS_NAMESPACE = '/ubiquityrobot/'

class ros_client {
  constructor(ros_base_url, btnHandler) {
    this.url = ros_base_url
    this.btnListener = null
    this.sensorStatusListener = null
    this.btnHandler = btnHandler
    this.sensorStatusHandler = null
    this.ros = null
    this.setSensorStatusHandler = this.setSensorStatusHandler.bind(this)
    // this.conectToRos()
  }

  conectToRos(callback) {
    console.log('trying to conect to ros server:')
    try {
      var ros = new ROSLIB.Ros({
        url: this.url
      });
    } catch (e) {
      console.log('ros client init error:', e)
      console.log('trying to reconect after 3 seconds')
      // return
      setTimeout(() => {
        this.conectToRos(callback)
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
      if (callback) {
        callback()
      }
    });

    ros.on('error', function(error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', () => {
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
      name: '/ubiquityrobot/pi_driver_node/sensor_status_change',
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

  setMotorEnable(port, value) {
    return new Promise((resolve) => {
      var apriltagDetectClient = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/motor_set_enable',
        serviceType: 'pi_driver/SetInt32'
      });

      var request = new ROSLIB.ServiceRequest({
        port: port,
        value: value
      });

      apriltagDetectClient.callService(request, (result) => {
        console.log(result)
        resolve()
      });
    })
  }
  getMotorEncoder(port) {
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
        resolve(result.position)
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
        console.log(result)
        resolve(result.motors)
      });
    })
  }
  setMotorSpeed(port, speed) {
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
  }

  getAccData() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_3axes',
        serviceType: 'pi_driver/SensorGet3Axes'
      });

      var request = new ROSLIB.ServiceRequest({
        id: 1
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  getGyroData() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_3axes',
        serviceType: 'pi_driver/SensorGet3Axes'
      });

      var request = new ROSLIB.ServiceRequest({
        id: 2
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
      });
    })
  }
  getMagnData() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/sensor_get_3axes',
        serviceType: 'pi_driver/SensorGet3Axes'
      });

      var request = new ROSLIB.ServiceRequest({
        id: 3
      });

      client.callService(request, (result) => {
        console.log(result)
        resolve(result.data)
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
        resolve(result.data)
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
        // console.log(result)
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

}

module.exports = ros_client