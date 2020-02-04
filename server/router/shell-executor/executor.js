const getUrlParam = require('../static/utils').getUrlParam
const path = require('path');

const child_process = require('child_process')
const spawn = child_process.spawn;
const exec = child_process.exec;

var my_process = null

function killByPid(pid) {
	if (/^win/.test(process.platform)) {
		child_process.spawnSync("taskkill", ["/PID", pid, "/T", "/F"])
	} else {
		// process.kill(-pid, 'SIGTERM')
		// child_process.spawnSync("killall", ["x-terminal-emulator"])
		child_process.spawnSync("killall", ["lxterminal"])
	}
}

function killProcess() {
	if (my_process && my_process.pid) {
		try {
			killByPid(my_process.pid)
		} catch (e) {

		}
	}
}

function clear_output() {
	var div = document.getElementById('output')
	div.innerHTML = ''
}

function append_output(data) {
	var div = document.getElementById('output')
	div.innerHTML = div.innerHTML + data.replace('/\n/g', '<br>')
}

function executeWeb(file) {
	killProcess()
	console.log(file)
	var extname = path.extname(file)
	var cmd = ''
	if (extname == '.py') {
		cmd = `python ${file}`
	} else if (extname == '.sh') {
		cmd = `bash ${file}`
	} else if (extname == '.mp3') {
		cmd = `mpg123 "${file}"`
	}
	console.log(cmd)
	clear_output()
	append_output(cmd + '<br>')
	my_process = spawn(cmd, {
		shell: true,
		detached: true
	});
	// 捕获标准输出并将其打印到控制台 
	my_process.stdout.on('data', function(data) {
		append_output(data)
		console.log('standard output:\n' + data);
	});

	// 捕获标准错误输出并将其打印到控制台 
	my_process.stderr.on('data', function(data) {
		append_output(data)
		console.log('stderr:\n' + data);
	});

	// 注册子进程关闭事件 
	my_process.on('exit', function(code, signal) {
		append_output('<br><span>Press any key to exit</span><label class="pointer"></label>')
		console.log('child process eixt ,exit:' + code);
		console.log(my_process)
	});
}

function executeTerminal(file) {
	console.log(file)
	if (my_process && my_process.pid) {
		try {
			killByPid(my_process.pid)
		} catch (e) {

		}
	}
	var extname = path.extname(file)
	var cmd = 'lxterminal'
	// var cmd = 'x-terminal-emulator'
	if (extname == '.py') {
		param = `-e 'python ${file}'`
	} else if (extname == '.sh') {
		param = `-e 'bash ${file};read'`
	} else if (extname == '.mp3') {
		param = `-e 'mpg123 ${file}'`
	} else {
		console.log("file type %s to be handled", extname)
		param = `-e 'echo  unsupported file type:${file}'`
	}
	console.log(cmd, param)
	my_process = spawn(cmd, [param], {
		shell: true,
		detached: true
	});
	console.log('start child_process with pid %d', my_process.pid)
	// my_process.stdin.write("\x03")
	// 捕获标准输出并将其打印到控制台 
	my_process.stdout.on('data', function(data) {
		console.log('stdout:\n' + data);
	});

	// 捕获标准错误输出并将其打印到控制台 
	my_process.stderr.on('data', function(data) {
		console.log('stderr:\n' + data);
	});

	// 注册子进程关闭事件 
	my_process.on('exit', function(code, signal) {
		console.log('child process eixt ,exit:' + code);
	});

}

function test() {
	// var file = getUrlParam('path')
	var file = "/home/hao/Programs/Python/hello.py"
	executeTerminal("/home/hao/Programs/Music/ANANT-GARDE EYES - theme of SSS.mp3")
	setTimeout(() => {
		executeTerminal(file)
		executeTerminal("/home/hao/Programs/Shell/test.sh")
	}, 3000)

}

// test()

module.exports = {
	killProcess: killProcess,
	executeTerminal: executeTerminal
}