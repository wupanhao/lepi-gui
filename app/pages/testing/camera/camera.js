'use strict';

angular.module('myApp.camera', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/camera', {
            templateUrl: 'pages/testing/camera/camera.html',
            // template: '<video src=""></video>',
            controller: 'CameraCtrl'
        });
    }])

    .controller('CameraCtrl', function ($rootScope, $scope, $location) {
        $rootScope.setStatusBar(true)
        $rootScope.items = []
        $rootScope.title = '摄像头测试'

        const localMenus = [
            {
                text: '全屏',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    const video = document.querySelector('video')
                    if (video.classList.contains('horizontal')) {
                        video.classList.remove('horizontal')
                    } else {
                        video.classList.add('horizontal')
                    }
                }
            },
        ]

        navigator.mediaDevices.enumerateDevices().then(devices => {
            const videoDevices = devices.filter(device => device.kind == 'videoinput')
            console.log(videoDevices)
            $rootScope.localMenus[$location.path()] = localMenus.concat(videoDevices.map((device, index) => {
                return {
                    text: device.label || '摄像头 ' + index,
                    callback: () => {
                        if ($scope.currentStream) {
                            $scope.currentStream.getTracks().forEach(track => {
                                track.stop();
                            });
                        }
                        const constraints = { video: { width: 640, height: 480, deviceId: { exact: device.deviceId } }, };
                        console.log(constraints)
                        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
                            const video = document.querySelector('video')
                            console.log('getUserMedia:', mediaStream)
                            $scope.currentStream = mediaStream
                            video.srcObject = mediaStream;
                            video.onloadedmetadata = function (e) {
                                video.play();
                            };
                        }).catch(function (err) {
                            console.log(err.name + ": " + err.message);
                        });
                    }
                }
            }))
            $rootScope.updatePageInfo()

        });
        $scope.$on('$routeChangeStart', function ($event, next, current) {
            // console.log('$routeChangeStart', $event, next, current)
            if ($scope.currentStream) {
                $scope.currentStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        });
        // return
        const constraints = { video: { width: 640, height: 480 } };
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            console.log('getUserMedia:', mediaStream)
            $scope.currentStream = mediaStream
            const video = document.querySelector('video');
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    });