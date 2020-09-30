if (typeof ROSLIB == 'undefined') {
    try {
        ROSLIB = require('roslib')
    } catch (error) {
        console.log(error)
    }
}

// import * as ROSLIB from 'roslib'

class JoystickController {

    joy = {
        Buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        Axes: [0, 0, 0, 0, 0, 0]
    }

    topic = null

    joyTopic = null

    joint_names = ['coxa_joint_r1', 'femur_joint_r1', 'tibia_joint_r1', 'coxa_joint_r2', 'femur_joint_r2', 'tibia_joint_r2',
        'coxa_joint_r3', 'femur_joint_r3', 'tibia_joint_r3', 'coxa_joint_l1', 'femur_joint_l1', 'tibia_joint_l1',
        'coxa_joint_l2', 'femur_joint_l2', 'tibia_joint_l2', 'coxa_joint_l3', 'femur_joint_l3', 'tibia_joint_l3']

    constructor(ros_url = null, walkingGaits = null, subJoyTopic = false) {

        if (!ros_url) {
            try {
                ros_url = `ws://${window.location.hostname}:9090`
            } catch (error) {
                console.log(error)
                ros_url = `ws://localhost:9090`
            }
        }

        this.ros = new ROSLIB.Ros({
            url: ros_url
        });
        this.ros.on('connection', () => {
            console.log('Connected to websocket server.', this.ros);

            if (walkingGaits) {
                this.walkingGaits = walkingGaits
                this.walkingGaits.onHexapodUpdate = this.onHexapodUpdate
                this.walkingGaits.onAnimation = this.onAnimation
            } else {
                try {
                    this.walkingGaits = new hexapod.WalkingGaits(this.onHexapodUpdate, this.onAnimation)
                } catch (error) {
                    console.log(error)
                }
            }

            this.topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/ubiquityrobot/hexapod_controller_node/joint_states',
                messageType: 'sensor_msgs/JointState'
            });

            this.joyTopic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/ubiquityrobot/joystick_node/joy_state',
                messageType: 'std_msgs/String'
            });
            if (subJoyTopic) {
                this.joyTopic.subscribe(this.onJoyMessage)
            }
        })

        this.ros.on('error', (err) => {
            console.log(err)
        })
    }

    onJoyMessage(message) {
        // console.log('Received message on ' + listener.name + ': ', message);
        let joyStates = JSON.parse(message.data)
        Object.assign(this.joy, joyStates)
        if (joyStates && joyStates.Buttons[7] == 1) {
            if (this.startPress == true) {
                return
            } else {
                this.walkingGaits.toggleAnimating()
                this.startPress = true
            }
        } else {
            this.startPress = false
        }
        if (joyStates && joyStates.Buttons[4] == 1) {
            if (this.resetPress == true) {
                return
            } else {
                this.walkingGaits.setState({ animationCount: 0 })
                this.walkingGaits.reset()
                this.resetPress = true
            }
        } else if (this.resetPress == true) {
            this.resetPress = false
        }
    }

    pubServoMsg(angles) {
        if (this.ros && this.topic) {
            var msg = new ROSLIB.Message({
                name: this.joint_names,
                position: angles.map(angle => angle / 180.0 * Math.PI)
            });
            console.log('pubServoMsg', msg)
            this.topic.publish(msg);
        }
    }

    setLegAngles(legs) {
        let angles = []
        // [0]RightMiddle [1]RightFront [2]LeftFront [3]LeftMiddle [4]LeftBack [5]RightBack
        let leg_ids = [1, 0, 5, 2, 3, 4]
        for (let i = 0; i < legs.length; i++) {
            const leg = legs[leg_ids[i]];
            // temp.concat([leg.pose.alpha, leg.pose.beta, leg.pose.gamma])
            angles.push(-leg.pose.alpha)
            angles.push(leg.pose.beta)
            angles.push(leg.pose.gamma)
        }
        this.pubServoMsg(angles)
    }

    onHexapodUpdate = (hexapod) => {
        this.setLegAngles(hexapod.legs)
    }

    onAnimation = () => {

        let { isForward, inWalkMode } = this.walkingGaits.state
        let hipSwing = this.walkingGaits.state.gaitParams.hipSwing

        if (this.walkingGaits.state.isTripodGait) {
            if (this.joy.Buttons[5] == 0) {
                this.walkingGaits.toggleGaitType()
                return
            }
        } else {
            if (this.joy.Buttons[5] == 1) {
                this.walkingGaits.toggleGaitType()
                return
            }
        }

        if (this.joy.Buttons[4] == 1) {
            this.walkingGaits.setState({ animationCount: 0 })
            let { tx, tz, rx, ry } = this.walkingGaits.state.gaitParams
            tx = this.joy.Axes[0] / 32767.0 * 0.25
            tz = this.joy.Axes[1] / 32767.0 * -0.5
            rx = this.joy.Axes[4] / 32767.0 * 15
            ry = this.joy.Axes[3] / 32767.0 * 15

            if (tx != this.walkingGaits.state.gaitParams.tx || tz != this.walkingGaits.state.gaitParams.tz || rx != this.walkingGaits.state.gaitParams.rx || ry != this.walkingGaits.state.gaitParams.ry) {
                const gaitParams = { ...this.walkingGaits.state.gaitParams, tx, tz, rx, ry }
                this.walkingGaits.setWalkSequence(gaitParams, this.walkingGaits.state.isTripodGait, inWalkMode)
            } else {
                return
            }
        } else if (this.joy.Axes[1] == 0 && this.joy.Axes[3] == 0) {
            this.walkingGaits.state.gaitParams.hipSwing = 5
            this.walkingGaits.setState({ gaitParams: this.walkingGaits.state.gaitParams })
            return
        } else {
            if (this.joy.Axes[3] == 0) {
                inWalkMode = true
                isForward = this.joy.Axes[1] < 0
                hipSwing = parseInt(Math.abs(this.joy.Axes[1]) / 32767.0 * 20) + 5
                if (hipSwing != this.walkingGaits.state.gaitParams.hipSwing) {
                    const gaitParams = { ...this.walkingGaits.state.gaitParams, 'hipSwing': hipSwing }
                    this.walkingGaits.setWalkSequence(gaitParams, this.walkingGaits.state.isTripodGait, inWalkMode)
                }
            } else {
                inWalkMode = false
                isForward = this.joy.Axes[3] < 0
                hipSwing = parseInt(Math.abs(this.joy.Axes[3]) / 32767.0 * 20) + 5
                if (hipSwing != this.walkingGaits.state.gaitParams.hipSwing) {
                    const gaitParams = { ...this.walkingGaits.state.gaitParams, 'hipSwing': hipSwing }
                    this.walkingGaits.setWalkSequence(gaitParams, this.walkingGaits.state.isTripodGait, inWalkMode)
                    // this.walkingGaits.state.gaitParams.hipSwing = hipSwing
                }
            }
        }
        this.walkingGaits.setState({ inWalkMode, isForward })
        return true
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JoystickController
}

// export { JoystickController }