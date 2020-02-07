const cpx = require("cpx");

cpx.copySync("node_modules/{angular,angular-*,bootstrap/dist,echarts/dist,roslib/build}/**/*", "app/lib", { clean: true })
cpx.copySync("node_modules/{jszip-utils/dist,scratch-*/dist/web,sweetalert/dist}/**/*", "app/lib", { clean: true })