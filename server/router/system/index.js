const express = require('express');
const path = require('path');
const os = require('os');
const ChildProcess = require('child_process');
const router = express.Router();
const {
	getLocalIps
} = require('../mdns')

function getDeviceInfo() {
	const info = {
		memory: {
			free: Math.floor(os.freemem() / 1024 / 1024),
			total: Math.floor(os.totalmem() / 1024 / 1024)
		},
		release: os.release(),
		arch: os.arch(),
		uptime: os.uptime(),
		platform: os.platform(),
		ips: getLocalIps(),
		loadavg: os.loadavg(),
		disk: {
			used: 0,
			total: 0
		}
	}

	return new Promise(resolve => {
		if (os.platform() == 'linux') {
			ChildProcess.exec(`df -h / | tail -n +2 | awk '{ print $3 " " $2 }'`, (error, stdout, stderr) => {
				if (error || stderr) {
					console.log(error)
				}
				const disk = stdout.trim().split(' ')
				if (disk[0] && disk[1]) {
					info.disk.used = disk[0]
					info.disk.total = disk[1]
				}
				resolve(info)
			})
		} else {
			resolve(info)
		}
	})
}

// getDeviceInfo().then(console.log)

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
router.get('/deviceInfo', function (req, res) {
	getDeviceInfo().then(info => {
		res.json(info)
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
	startPiDriver: startPiDriver,
	startDuckService: startDuckService,
	resetAll: resetAll
}
