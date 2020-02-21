'use strict';
function setOutAudioDevices(element, deviceId) {
    return new Promise((resolve, reject) => {
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(deviceId)
                .then(() => {
                    resolve(`Success, audio output device attached: ${deviceId} to element with ${element.title} as source.`)
                })
                .catch(error => {
                    let errorMessage = error
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`
                    }
                    reject(errorMessage)
                })
        } else {
            reject(new Error('Browser does not support output device selection.'))
        }
    })
}
angular.module('myApp.speaker', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/speaker', {
            templateUrl: 'pages/testing/speaker/speaker.html',
            // template: '<video src=""></video>',
            controller: 'SpeakerCtrl'
        });
    }])

    .controller('SpeakerCtrl', function ($rootScope, $scope) {
        $rootScope.setStatusBar(true)
        $rootScope.items = []
        $rootScope.title = '扬声器测试'

        $rootScope.menus = [

        ]

        navigator.mediaDevices.enumerateDevices().then(devices => {
            const speakerDevices = devices.filter(device => device.kind == 'audiooutput')
            console.log(speakerDevices)
            $rootScope.menus = $rootScope.menus.concat(speakerDevices.map((device, index) => {
                return {
                    text: device.label || '扬声器 ' + index,
                    callback: () => {
                        if ($scope.currentStream) {
                        }
                        const audio = document.querySelector('audio')
                        setOutAudioDevices(audio, device.deviceId)
                    }
                }
            }))
            $rootScope.updatePageInfo()

        });
        $scope.$on('$routeChangeStart', function ($event, next, current) {
            // console.log('$routeChangeStart', $event, next, current)
            if ($scope.currentStream) {
            }
        });

        // return
        const constraints = { audio: true };
        console.log(constraints)
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            // const audio = document.querySelector('audio')
            console.log('getUserMedia:', mediaStream)
            mediaStream.getTracks().forEach(track => {
                track.stop();
            });
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });

    });