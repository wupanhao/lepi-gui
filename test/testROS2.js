const ROSLIB = require('roslib');
const ROS_NAMESPACE = '/ubiquityrobot/'

let ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});

function getSensorValue(port) {
    return new Promise((resolve) => {
        var client = new ROSLIB.Service({
            ros: ros,
            name: 'add_two_ints',
            serviceType: 'example_interfaces/AddTwoInts'
        });

        var request = new ROSLIB.ServiceRequest({
            a: 1,
            b: 2
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
    // testParams()
});

async function testService() {
    console.time("执行1000次call service 共花费了");
    for (let index = 0; index < 1000; index++) {
        let res = await getSensorValue()
    }
    console.timeEnd("执行1000次call service 共花费了");
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
