let hexapod = require('./hexapod')
let joystickController = require('./joystickController')

let controller = new joystickController({
    walkingGaits: new hexapod.WalkingGaits(),
    subJoyTopic: true,
    onNodeExit: () => {
        console.log(process.pid, 'SIGTERM')
        process.kill(process.pid, 'SIGTERM')
    }
})
