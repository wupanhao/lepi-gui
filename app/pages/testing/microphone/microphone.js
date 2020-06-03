'use strict';

angular.module('myApp.microphone', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/microphone', {
            templateUrl: 'pages/testing/microphone/microphone.html',
            // template: '<video src=""></video>',
            controller: 'MicrophoneCtrl'
        });
    }])

    .controller('MicrophoneCtrl', function ($rootScope, $scope, $location) {
        $rootScope.setStatusBar(true)
        $rootScope.items = []
        $rootScope.title = '麦克风测试'

        $scope.$on('$routeChangeStart', function ($event, next, current) {
            // console.log('$routeChangeStart', $event, next, current)
            if ($scope.currentStream) {
                $scope.currentStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        });


        var chart = document.getElementById('myChart');
        // 初始化echarts对象
        var myChart = echarts.init(chart);

        const NUM = 240

        var series = [{
            name: 'x',
            type: 'line',
            symbol: 'none',
            data: new Array(NUM).fill(0)
        }]

        // myChart.hideLoading();
        // option 里面的内容基本涵盖你要画的图表的所有内容
        // 定义样式和数据
        var option = {
            title: {
                text: '音量检测',
                left: 'center',
                textStyle: {
                    color: '#FFF',
                },
            },
            // 给echarts图设置背景色
            // backgroundColor: '#FBFBFB',                  // -----------> // 给echarts图设置背景色   
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['x'],
                orient: 'vertical',
                left: 'right',
                // aline: 'right',
                show: false,
            },
            grid: {
                left: 'left',
                right: '0',
                bottom: '0'
            },

            calculable: true,

            xAxis: [{
                type: 'category',
                // boundaryGap: false,
                data: new Array(NUM).fill(' '),
                show: false
            }],
            yAxis: [{
                type: 'value',
                min: -1.0, // 设置y轴刻度的最小值
                max: 1.0,  // 设置y轴刻度的最大值
                position: 'left',
                show: false
            }],
            series: series
        };
        myChart.setOption(option);

        const scriptProcessor = audioContext.createScriptProcessor(512, 1, 1)

        scriptProcessor.connect(audioContext.destination)

        var updateData = () => {
            setTimeout(() => {
                myChart.setOption(option);
                // console.log(option.series[0].data)
                updateData()
            }, 20)
        }

        myChart.setOption(option);
        scriptProcessor.addEventListener('audioprocess', function (event) {
            // console.log(event)
            var data = event.inputBuffer.getChannelData(0)
            // option.series[0].data = Array.prototype.slice.call(data);
            option.series[0].data.shift()
            option.series[0].data.push(Math.max(...data))
            // option.series[0].data.push(data[0])
            // console.log(data)
        })
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (mediaStream) {
            $scope.currentStream = mediaStream
            console.log('getUserMedia:', mediaStream)
            audioContext.resume().then(() => {
                audioContext.createMediaStreamSource(mediaStream).connect(scriptProcessor)
                updateData()
            })
            console.log(scriptProcessor)
        }).catch(function (err) {
            console.log(err)
        })

        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind == 'audioinput')
            console.log(videoDevices)
            $rootScope.localMenus[$location.path()] = videoDevices.map((device, index) => {
                return {
                    text: device.label || '麦克风 ' + index,
                    callback: () => {
                        if ($scope.currentStream) {
                            $scope.currentStream.getTracks().forEach(track => {
                                track.stop();
                            });
                        }
                        const constraints = { audio: { deviceId: { exact: device.deviceId } }, };
                        console.log(constraints)
                        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
                            $scope.currentStream = mediaStream

                            console.log('getUserMedia:', mediaStream)
                            audioContext.resume().then(() => {
                                audioContext.createMediaStreamSource(mediaStream).connect(scriptProcessor)
                                updateData()
                            })
                            console.log(scriptProcessor)

                        }).catch(function (err) {
                            console.log(err.name + ": " + err.message);
                        });
                    }
                }
            })
            $rootScope.updatePageInfo()

        });

    });