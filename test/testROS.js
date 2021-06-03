const ROSLIB = require('roslib');
const ROS_NAMESPACE = '/ubiquityrobot/'

let ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});

function getSensorValue(port) {
    return new Promise((resolve) => {
        var client = new ROSLIB.Service({
            ros: ros,
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

ros.on('connection', () => {
    console.log('Connected to websocket server.');
    testService()
    testParams()
});

async function testService() {
    console.time("执行100次call service 共花费了");
    for (let index = 0; index < 100; index++) {
        let res = await getSensorValue()
    }
    console.timeEnd("执行100次call service 共花费了");
    ros.close()
}

async function testParams() {
    console.time("执行100次get params 共花费了");
    for (let index = 0; index < 100; index++) {
       let res = await new Promise(resolve => {
           ros.getParams((list) => {
               // console.log(list)
               resolve()
           })
       }) 
    }
    console.timeEnd("执行100次get params 共花费了");
    ros.close()
}
