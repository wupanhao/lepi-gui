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

        const items = [{
            title: '音量检测',
            sensorId: 1
        }, {
            title: '时域波形',
            sensorId: 2
        }, {
            title: '频域波形',
            sensorId: 3
        },
        ]
        $rootScope.items = items
        $rootScope.rowNum = 1
        $rootScope.colNum = 1

        var wave;
        var rec = Recorder({
            onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate) {
                wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);//输入音频数据，更新显示波形
            }
        });

        $rootScope.localCallback[$location.path()] = (index) => {
            $rootScope.title = items[index].title
            try {
                rec._stop()
                rec.close()
            } catch (error) {
                console.log(error)
            }
            // audioContext = new (window.AudioContext || window.webkitAudioContext)()
            // rec.Ctx = audioContext
            rec.open(() => {
                if (index == 0) {
                    wave = Recorder.WaveView({ elem: "#myChart" }); //创建wave对象
                } else if (index == 1) {
                    wave = Recorder.WaveSurferView({ elem: "#myChart", direction: -1 }); //创建wave对象
                } else {
                    wave = Recorder.FrequencyHistogramView({ elem: "#myChart", lineCount: 60,fps:10, fallDuration: 500, stripeFallDuration: 1000, scale: 1 }); //创建wave对象
                }
                rec.start();
            });

        }

        $scope.$on('$routeChangeStart', ($event, next, current) => {
            console.log(rec)
            rec._stop()
            rec.close()
            // audioContext = rec.Ctx
        });
        $rootScope.updatePageInfo()

    });