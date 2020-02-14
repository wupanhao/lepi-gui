'use strict';

angular.module('myApp.camera', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/camera', {
            templateUrl: 'pages/testing/camera/camera.html',
            // template: '<video src=""></video>',
            controller: 'CameraCtrl'
        });
    }])

    .controller('CameraCtrl', function ($rootScope) {
        $rootScope.setStatusBar(true)
        $rootScope.items = []
        $rootScope.title = '摄像头测试'
        $rootScope.updatePageInfo()
        const constraints = { video: { width: 640, height: 480 } };
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            console.log('getUserMedia:', mediaStream)
            const video = document.querySelector('video');
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                video.play();
            };
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
    });