const express = require('express');
const path = require('path');

const router = express.Router();

const ChildProcess = require('child_process');

function checkCameraConnection() {
	return new Promise((resolve, reject) => {
		ChildProcess.exec("vcgencmd get_camera", (error, stdout, stderr) => {
			if (error || stderr) {
				console.error(`error: ${error}`);
				console.error(`stderr: ${stderr}`);
				error && reject(error)
				stderr && reject(stderr)
				return;
			}
			var pattern = /detected=(\d{1})/
			var match = stdout.match(pattern);
			// console.log(match)
			if (match && match[1] == '1') {
				resolve(true)
			} else {
				resolve(true)
			}
		})
	})
}

function startPiDriver() {
	// ChildProcess.exec(`source /home/pi/workspace/lepi_gui/ros_env.sh && roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log `)
	// ChildProcess.exec(`docker restart demo_duck && docker exec -t  demo_duck bash -c "source /demo_duck/env.sh && roslaunch pi_driver pi_driver_node.launch"  > /tmp/duckie.log &`)
	// ChildProcess.exec(`docker run -t -v /home/pi:/home/pi --net host --privileged --rm --name lepi_server wupanhao/lepi_server:melodic bash -c "source env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &`)
	// ChildProcess.exec(`source /home/pi/workspace/lepi_gui/ros_env.sh ; roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log`)
}

function startDuckService() {
	// ChildProcess.exec(`source /home/pi/workspace/lepi_gui/ros_env.sh && roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log `)
	// ChildProcess.exec(`docker run -t -v /home/pi:/home/pi --net host --privileged --rm --name lepi_server wupanhao/lepi_server:melodic bash -c "source env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &`)
	// ChildProcess.exec(`source /home/pi/workspace/lepi_gui/ros_env.sh ; roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log`)
}
function resetAll() {
	file_name = path.join(__dirname, 'stopMotors.py')
	ChildProcess.exec(`sudo killall lxterminal;python ${file_name}`)
}
router.get('/camera_connected', function (req, res) {
	checkCameraConnection().then(connected => {
		if (connected) {
			console.log('connected')
		} else {
			console.log('not connected')
		}
		res.json({
			connected: connected
		})
	})
})

router.get('/halt', function (req, res) {
	res.json({
		status: 'ok'
	})
	ChildProcess.exec("rosnode kill -a", () => {
		ChildProcess.exec("sudo halt")
	})
})
router.get('/reboot', function (req, res) {
	res.json({
		status: 'ok'
	})
	ChildProcess.exec("rosnode kill -a", () => {
		ChildProcess.exec("sudo reboot")
	})
})
router.get('/start_pi_driver', function (req, res) {
	res.json({
		status: 'ok'
	})
	startPiDriver()
})

router.get('/start_duck_service', function (req, res) {
	res.json({
		status: 'ok'
	})
	startDuckService()
})

module.exports = {
	systemRouter: router,
	checkCameraConnection: checkCameraConnection,
	startPiDriver: startPiDriver,
	startDuckService: startDuckService,
	resetAll: resetAll
}
