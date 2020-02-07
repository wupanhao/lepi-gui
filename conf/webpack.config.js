var path = require('path');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        dist: './src/index.js'
    },
    output: {
        path: path.resolve('dist', 'web'),
        library: 'AudioEngine',
        libraryTarget: 'umd',
        filename: 'scratch-audio.js'
    },

};
