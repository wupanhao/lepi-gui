'use strict';

angular.module('myApp.testing', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/testing', {
      templateUrl: 'pages/testing/testing.html',
      controller: 'TestingCtrl'
    })
  }])

  .controller('TestingCtrl', function ($rootScope) {

    const items = [
      {
        link: '#!9_axis',
        src: "assets/images/9_axis.png",
        name: '九轴'
      },
      {
        link: '#!camera',
        src: "assets/images/camera.png",
        name: '摄像头'
      },
      {
        link: '#!microphone',
        src: "assets/images/microphone.png",
        name: '麦克风'
      },
      {
        link: '#!speaker',
        src: "assets/images/volume.png",
        name: '扬声器'
      },
      {
        link: '#!motor',
        src: "assets/images/motor.png",
        name: '电机'
      },
      {
        link: '#!servo',
        src: "assets/images/servo.png",
        name: '舵机'
      },
      {
        link: '#!sservo',
        src: "assets/images/servo.png",
        name: '智能舵机'
      },
      {
        link: '#!sensor',
        src: "assets/images/sensor.png",
        name: '智能传感器'
      },
    ]

    $rootScope.items = items
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    $rootScope.updatePageInfo()

  });