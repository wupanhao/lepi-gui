const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ChildProcess = require('child_process');
const router = express.Router();
const {
	getLocalIps,
	getMAC
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

let devInfo = {
	memory: {
		used: 0,
		total: 0
	},
	uuid: getMAC(),
	release: os.release(),
	arch: os.arch(),
	platform: os.platform(),
	disk: {
		used: 0,
		total: 0
	}
}

function measureTemp(callback) {
	var regex = /temp=([^'C]+)/;
	var cmd = ChildProcess.spawn("/opt/vc/bin/vcgencmd", ["measure_temp"]);

	cmd.stdout.on("data", function (buf) {
		callback(null, parseFloat(regex.exec(buf.toString("utf8"))[1]));
	});

	cmd.stderr.on("data", function (buf) {
		callback(new Error(buf.toString("utf8")));
	});
};


function getDeviceInfo() {

	devInfo.uptime = os.uptime()
	devInfo.ips = getLocalIps()
	devInfo.loadavg = os.loadavg()

	return new Promise(resolve => {
		if (os.platform() == 'linux') {
			ChildProcess.exec(`df -h / | tail -n +2 | awk '{ print $3 " " $2 }'`, (error, stdout, stderr) => {
				if (error || stderr) {
					console.log(error)
				}
				const disk = stdout.trim().split(' ')
				if (disk[0] && disk[1]) {
					devInfo.disk.used = disk[0]
					devInfo.disk.total = disk[1]
				}
				ChildProcess.exec(`free -m | head -n +2 | tail -n +2 | awk '{print $2 " " $3}'`, (error, stdout, stderr) => {
					if (error || stderr) {
						console.log(error)
					}
					const memory = stdout.trim().split(' ')
					if (memory[0] && memory[1]) {
						devInfo.memory.used = memory[1]
						devInfo.memory.total = memory[0]
					}
					measureTemp((err, temp) => {
						devInfo.temp = temp
						resolve(devInfo)
					})
					// resolve(devInfo)
				})
			})
		} else {
			resolve(devInfo)
		}
	})
}

/*
getDeviceInfo().then(info => {
	console.log(info)
	if (info.disk.total < 14) {
		console.log('automatically expand file system and reboot')
		const out = ChildProcess.execSync('sudo raspi-config  --expand-rootfs')
		console.log(out)
		ChildProcess.execSync('sudo reboot')
	}
})
*/

function stopAll() {
	file_name = path.join(__dirname, 'stopMotors.py')
	// ChildProcess.exec(`DISPLAY=:0.1 xdotool mousemove --screen 0  120 300 ; sudo killall konsole;python ${file_name}`)
	ChildProcess.exec(`python ${file_name}`)
}

function executeTerminal(file) {
	console.log(file)

	var extname = path.extname(file)
	var dir = path.dirname(file)
	var filename = path.basename(file)
	var cmd = `DISPLAY=:0.1 konsole --hide-menubar -p TerminalRows=19 -p TerminalColumns=34 -e bash -c "xdotool mousemove --screen 1  120 300 click 1 ; cd ${dir} && `
	// var cmd = 'x-terminal-emulator'
	if (extname == '.py') {
		param = `python ${filename};bash"`
	} else if (extname == '.sh') {
		param = `bash ${filename};bash"`
	} else if (extname == '.js') {
		param = `source ~/nodejs.sh && node ${filename};bash"`
	} else {
		param = `./${filename};bash"`
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
		ChildProcess.execSync(`DISPLAY=:0.1 xdotool mousemove --screen 1  120 300 click 1; sudo killall konsole `)
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
	// var buf3 = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && bash update.sh')
	console.log(`${buf}\n${buf2}\n`)
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

router.get('/usb_reset', function (req, res) {
	try {
		var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && sudo ./scripts/usbreset /dev/bus/usb/003/001 2>&1')
		console.log(`${buf}`)
	} catch (error) {
		console.log(error, `${error.output}`)
	}
	// var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && ~/workspace/xpack-openocd-0.10.0-14/bin/openocd -c "set FIRMWARE_FILE ./firmware/lepi_samd51_latest.hex" -f ~/workspace/lepi-gui/conf/lepi-d51.cfg 2>&1')
	var msg = `已执行`
	var code = 0
	res.json({
		code: code,
		msg: msg
	})
})

/* sample output
`
Calibrating EVDEV driver for "ADS7846 Touchscreen" id=6
	current calibration values (from XInput): min_x=208, max_x=3862 and min_y=137, max_y=3693

Doing dynamic recalibration:
	Inverting X and/or Y axis...
	Setting calibration data: 3837, 203, 3977, 414
	--> Making the calibration permanent <--
  copy the snippet below into '/etc/X11/xorg.conf.d/99-calibration.conf' (/usr/share/X11/xorg.conf.d/ in some distro's)
Section "InputClass"
	Identifier	"calibration"
	MatchProduct	"ADS7846 Touchscreen"
	Option	"Calibration"	"3837 203 3977 414"
	Option	"SwapAxes"	"0"
EndSection
`
*/

let calibration_conf = `
#/etc/X11/xorg.conf.d/99-calibration.conf
Section "InputClass"
        Identifier      "calibration"
        MatchProduct    "ADS7846 Touchscreen"
        Option  "Calibration" "min_x max_x min_y max_y"
# 240x320 LCD LeftOf 1280x720 HDMI
        Option  "TransformationMatrix" "0.1579 0 0 0 0.4444 0 0 0 1"
        Option  "SwapAxes"      "0"
        Option  "InvertX"       "1"
        Option  "InvertY"       "1"
EndSection
`

router.get('/calibrate', function (req, res) {
	try {
		let buf = ChildProcess.execSync('sudo killall xinput_calibrator; DISPLAY=:0.1 xinput_calibrator')
		let out = buf.toString()
		let result = out.match(/Option	"Calibration"	"(\d+) (\d+) (\d+) (\d+)"/)
		if (result.length == 5) {
			let conf = calibration_conf.replace('min_x max_x min_y max_y', `${result[2]} ${result[1]} ${result[4]} ${result[3]}`)
			fs.writeFileSync('/tmp/99-calibration.conf', conf)
			ChildProcess.execSync('sudo cp /tmp/99-calibration.conf /etc/X11/xorg.conf.d/99-calibration.conf')
		}
		console.log(out)
	} catch (error) {
		console.log(error, `${error.output}`)
	}
	// var buf = ChildProcess.execSync('cd /home/pi/workspace/lepi-gui && ~/workspace/xpack-openocd-0.10.0-14/bin/openocd -c "set FIRMWARE_FILE ./firmware/lepi_samd51_latest.hex" -f ~/workspace/lepi-gui/conf/lepi-d51.cfg 2>&1')
	var msg = `已执行`
	var code = 0
	res.json({
		code: code,
		msg: msg
	})
})

router.get('/hardware_model', function (req, res) {
	let buf = ChildProcess.execSync('tail -n 4 /proc/cpuinfo')
	let out = buf.toString().trim()
	let arr = out.split('\n')
	let info = {}
	for (let i = 0; i < arr.length; i++) {
		const ele = arr[i].split(':');
		if (ele && ele.length == 2) {
			info[ele[0].trim()] = ele[1].trim()
		}
	}
	res.json(info)
})

module.exports = {
	systemRouter: router,
	stopAll: stopAll
}
