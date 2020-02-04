const env = {
	api_base_url: 'http://localhost:8000',
	ros_base_url: 'ws://localhost:9090',
	index_base_url: 'http://localhost:8000/index'
}
var localSettings = null;
try {
	localSettings = require('./env.local');
	Object.assign(env, localSettings);
	console.log('use local setting')
} catch (e) {
	console.log('no local setting found')
}

console.log(env)

module.exports = env