'use strict';

angular.module('myApp.testing', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/testing', {
      templateUrl: 'pages/testing/testing.html',
      controller: 'TestingCtrl'
    })
  }])

  .controller('TestingCtrl', function ($scope, $routeParams, $rootScope,$location) {

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

    $scope.items = items
    const pageIndex = $location.search().page | 0
    $scope.pageInfo = {
      itemIndex: 0,
      pageIndex: pageIndex,
      pageNum: Math.ceil(items.length / 6)
    }
    var start = $scope.pageInfo.pageIndex * 6
    $scope.show = items.slice(start,start+ 6).map((item,id) => {
      item.id = id
      return item
    })

    console.log($scope)
    $scope.click = (id) => {
      console.log(id)
      $scope.pageInfo.itemIndex = id
      console.log($scope.pageInfo)
    }
    $scope.$on('keyEvent/testing', (name, e) => {
      console.log('testing', e)
      switch (e.keyCode) {
        case KEY.ArrowLeft:
          if ($scope.pageInfo.itemIndex > 0) {
            $scope.pageInfo.itemIndex--
          }
          break;
        case KEY.ArrowRight:
          if ($scope.pageInfo.itemIndex < $scope.show.length - 1) {
            $scope.pageInfo.itemIndex++
          }
          break;
        case KEY.ArrowUp:
          break;
        case KEY.ArrowDown:
          break;
        case KEY.Enter:
          break;
        case KEY.M:
          break;
        case KEY.B:
          break;
        case KEY.R:
          break;
        case KEY.S:
          break;
      }
      var i = $scope.pageInfo.itemIndex
      document.getElementsByClassName('card')[i].click(i)
      console.log($scope.pageInfo)
    })

  });