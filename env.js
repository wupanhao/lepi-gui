const env = {
	api_base_url: 'http://localhost:8000',
	ros_base_url: 'ws://localhost:9090',
	index_base_url: 'http://localhost:8000/index'
}
var localSettings = null;
try {
	localSettings = require('./env.local');
	Object.assign(env, localSettings);
	console.log('use local setting', localSettings)
} catch (e) {
	console.log('no local setting found')
	console.log(env)
}
/*
export ELECTRON_GET_USE_PROXY=1 # 值为1或true
export GLOBAL_AGENT_HTTP_PROXY=http://192.168.50.243:10809
export GLOBAL_AGENT_HTTPS_PROXY=https://192.168.50.243:10809
*/
// export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
module.exports = env
