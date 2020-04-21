'use strict';

const testingPages = [
  {
    id: 0,
    link: '#!/testing/9_axis',
    src: `assets/themes/${iconTheme}/icon-9axes.png`,
    name: '九轴传感器'
  },
  {
    id: 1,
    link: '#!/testing/camera',
    src: `assets/themes/${iconTheme}/icon-camera.png`,
    name: '摄像头'
  },
  {
    id: 2,
    link: '#!/testing/microphone',
    src: `assets/themes/${iconTheme}/icon-microphone.png`,
    name: '麦克风'
  },
  {
    id: 3,
    link: '#!/testing/speaker',
    src: `assets/themes/${iconTheme}/icon-speaker.png`,
    name: '扬声器'
  },
  {
    id: 4,
    link: '#!/testing/motor',
    src: `assets/themes/${iconTheme}/icon-motor.png`,
    name: '电机'
  },
  {
    id: 5,
    link: '#!/testing/servo',
    src: `assets/themes/${iconTheme}/icon-servo.png`,
    name: '舵机'
  },
  {
    id: 6,
    link: '#!/testing/sservo',
    src: `assets/themes/${iconTheme}/icon-smart-servo.png`,
    name: '智能舵机'
  },
  {
    id: 7,
    link: '#!/testing/sensor',
    src: `assets/themes/${iconTheme}/icon-smart-sensor.png`,
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