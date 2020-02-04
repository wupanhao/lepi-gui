const ROSLIB = require('roslib');
const ROS_NAMESPACE = '/ubiquityrobot/'

class ros_client {
  constructor(ros_base_url, btnHandler) {
    this.url = ros_base_url
    this.listener = null
    this.btnHandler = btnHandler
    this.ros = null
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
    if (this.listener != null) {
      this.listener.unsubscribe();
    }
    var listener = new ROSLIB.Topic({
      ros: ros,
      name: '/ubiquityrobot/pi_driver_node/button_event',
      messageType: 'pi_driver/ButtonEvent'
    });

    ros.on('connection', () => {
      console.log('Connected to websocket server.');
      if (this.btnHandler) {
        listener.subscribe(this.btnHandler);
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
    this.listener = listener
  }
  isConnected() {
    return this.ros && this.ros.isConnected
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

  setMotorSpeed(port, speed) {
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

  getAccData() {
    return new Promise((resolve) => {
      var client = new ROSLIB.Service({
        ros: this.ros,
        name: ROS_NAMESPACE + 'pi_driver_node/senser_get_3axes',
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
        name: ROS_NAMESPACE + 'pi_driver_node/senser_get_3axes',
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
        name: ROS_NAMESPACE + 'pi_driver_node/senser_get_3axes',
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
        name: ROS_NAMESPACE + 'pi_driver_node/senser_get_3axes',
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