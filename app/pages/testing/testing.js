'use strict';

const testingPages = [
  {
    id: 0,
    link: '#!/9_axis',
    src: "assets/images/9_axis.png",
    name: '九轴传感器'
  },
  {
    id: 1,
    link: '#!/camera',
    src: "assets/images/camera.png",
    name: '摄像头'
  },
  {
    id: 2,
    link: '#!/microphone',
    src: "assets/images/microphone.png",
    name: '麦克风'
  },
  {
    id: 3,
    link: '#!/speaker',
    src: "assets/images/volume.png",
    name: '扬声器'
  },
  {
    id: 4,
    link: '#!/motor',
    src: "assets/images/motor.png",
    name: '电机'
  },
  {
    id: 5,
    link: '#!/servo',
    src: "assets/images/servo.png",
    name: '舵机'
  },
  {
    id: 6,
    link: '#!/sservo',
    src: "assets/images/servo.png",
    name: '智能舵机'
  },
  {
    id: 7,
    link: '#!/sensor',
    src: "assets/images/sensor.png",
    name: '智能传感器'
  },
]

angular.module('myApp.testing', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/testing', {
      templateUrl: 'pages/templates/item_small.html',
      controller: 'TestingCtrl'
    })
  }])

  .controller('TestingCtrl', function ($rootScope) {
    $rootScope.show_header = true
    $rootScope.title = '内置测试'
    $rootScope.items = testingPages
    $rootScope.rowNum = 3
    $rootScope.colNum = 2  
    $rootScope.updatePageInfo()

  });