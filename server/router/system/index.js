const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ChildProcess = require('child_process');
const router = express.Router();
const {
	getLocalIps
} = require('../mdns')

const AudioControl = require('./audio-control')

const audio = new AudioControl()

var my_process

const info = {
	speaker: 50,
	headphone: 50,
	microphone: 50
}

audio.set('speaker', 70).then(() => {
	audio.getAll(data => {
		Object.assign(info, data)
	})
})

function getDeviceInfo() {
	const info = {
		memory: {
			used: 0,
			total: 0
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
				ChildProcess.exec(`free -m | head -n +2 | tail -n +2 | awk '{print $2 " " $3}'`, (error, stdout, stderr) => {
					if (error || stderr) {
						console.log(error)
					}
					const memory = stdout.trim().split(' ')
					if (memory[0] && memory[1]) {
						info.memory.used = memory[1]
						info.memory.total = memory[0]
					}
					resolve(info)
				})
			})
		} else {
			resolve(info)
		}
	})
}

// getDeviceInfo().then(console.log)


function stopAll() {
	file_name = path.join(__dirname, 'stopMotors.py')
	// ChildProcess.exec(`DISPLAY=:0.1 xdotool mousemove --screen 0  120 300 ; sudo killall konsole;python ${file_name}`)
	ChildProcess.exec(`python ${file_name}`)
}

function executeTerminal(file) {
	console.log(file)

	var extname = path.extname(file)
	var cmd = 'DISPLAY=:0.1 konsole -p TerminalRows=19 -p TerminalColumns=34 -e bash -c "xdotool mousemove --screen 1  120 300 click 1 ;'
	// var cmd = 'x-terminal-emulator'
	if (extname == '.py') {
		param = `python ${file};bash"`
	} else if (extname == '.sh') {
		param = `bash ${file};bash"`
	} else {
		param = `${file}"`
	}

	if (my_process && !my_process.killed) {
		my_process.kill()
	}

	my_process = ChildProcess.spawn(cmd, [param], {
		shell: true,
		detached: true
	});

	console.log(cmd, param)
	console.log('start child_process with pid %d', my_process.pid)

}

router.get('/execFile', function (req, res) {
	console.log(req.query)
	const file = decodeURI(req.query['path'])
	if (file && fs.existsSync(file)) {
		executeTerminal(file)
		res.json({
			status: 'ok'
		})
	} else {
		res.json({
			status: 'fail',
			msg: 'file_path不存在'
		})
	}
})

router.get('/openTerminal', function (req, res) {
	console.log(req.query)
	executeTerminal('bash')
	res.json({
		status: 'ok',
		msg: 'terminal is open'
	})
})

router.get('/closeTerminal', function (req, res) {
	console.log(req.query)
	try {
		ChildProcess.execSync(`DISPLAY=:0.1 xdotool mousemove --screen 0  120 300 ; sudo killall konsole`)
	} catch (error) {
		console.log(error)
	}
	res.json({
		status: 'ok',
		msg: 'terminal is close'
	})
})

router.get('/inputString', (req, res) => {
	console.log(req.query)
	var input = decodeURI(req.query.input)
	if (input) {
		input = input.replace("'", "\'")
	}
	const enter = req.query.enter

	var cmd = `export DISPLAY=:0.1 && xdotool type '${input}'`
	if (enter)
		cmd = cmd + ' && xdotool key Return'
	console.log(cmd)
	ChildProcess.exec(cmd, (error, stdout, stderr) => {
		if (error || stderr) {
			console.log(error, stderr)
		}
		res.json({
			status: 'ok',
			msg: '输入完成'
		})
	})
})

router.get('/inputKey', (req, res) => {
	console.log(req.query)
	var keys = Object.keys(req.query).join('+')
	var cmd = `export DISPLAY=:0.1 && xdotool key ${keys}`
	console.log(cmd)
	ChildProcess.exec(cmd, (error, stdout, stderr) => {
		if (error || stderr) {
			console.log(error, stderr)
		}
		if (stdout) {
			resolve(stdout.trim())
		} else {
			resolve()
		}
	})
})

router.get('/stopAll', function (req, res) {
	stopAll()
	res.json({
		status: 'ok'
	})
})

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


router.get('/audio', function (req, res) {
	console.log(req.query)
	const dev = req.query['dev']
	const value = req.query['value']
	if (dev) {
		if (value) {
			audio.set(dev, value).then(volume => {
				info[dev] = volume
				res.json(info)
			})
		} else {
			audio.get(dev).then(volume => {
				info[dev] = volume
				res.json(info)
			})
		}
	} else {
		audio.getAll().then(data => {
			Object.assign(info, data)
			res.json(info)
		})
	}
})

router.get('/reset_soundrc', function (req, res) {
	audio.setSoundrc()
	res.json({
		code: 0,
		msg: '操作已执行,重启后生效'
	})
})

router.get('/expand_rootfs', function (req, res) {
	const out = ChildProcess.execSync('sudo raspi-config  --expand-rootfs')
	console.log(out)
	res.json({
		code: 0,
		msg: '操作已执行,重启后生效'
	})
})

router.get('/update', function (req, res) {
	var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && git reset HEAD --hard && git pull')
	var buf2 = ChildProcess.execSync('cd /home/pi/workspace/lepi-ros-server && git reset HEAD --hard && git pull')
	console.log(`${buf}`)
	var msg = `未知错误`
	var code = -99
	const out = buf.toString()
	if (out.indexOf('Already up to date') >= 0) {
		msg = '已经是最新系统'
		code = 0
	} else if (out.indexOf('Aborting') >= 0 || out.indexOf('error') >= 0) {
		msg = '更新出错'
		code = -1
	} else if (out.indexOf('Updating') >= 0) {
		msg = '更新成功，重载或重启后生效'
		code = 1
	}
	res.json({
		code: code,
		msg: msg
	})
})

router.get('/update_firmware', function (req, res) {
	var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && ./flash-firmware.sh ./firmware/lepi_samd51_latest.hex 2>&1')
	// var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && ~/workspace/xpack-openocd-0.10.0-14/bin/openocd -c "set FIRMWARE_FILE ./firmware/lepi_samd51_latest.hex" -f ~/workspace/lepi-gui/conf/lepi-d51.cfg 2>&1')
	console.log(`${buf}`)
	var msg = `未知错误`
	var code = -99
	const out = buf.toString()
	if (out.indexOf('Verified OK') >= 0) {
		msg = '更新成功'
		code = 0
	} else {
		msg = '更新出错'
		code = -1
	}
	res.json({
		code: code,
		msg: msg
	})
})

module.exports = {
	systemRouter: router,
	stopAll: stopAll
}
