const ChildProcess = require('child_process');

function PromisifyExec(cmd) {
	return new Promise(resolve => {
		ChildProcess.exec(cmd, (error, stdout, stderr) => {
			if (error || stderr) {
				console.log(error, stderr)
			}
			if (stdout) {
				resolve(stdout)
			} else {
				resolve()
			}
		})
	})
}

PromisifyExec('rosnode list').then(output => {
	console.log(output)
	if (output) {
		console.log(output.trim().split('\n'))
	}
})