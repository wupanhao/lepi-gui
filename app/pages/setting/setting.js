'use strict';

angular.module('myApp.setting', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/setting', {
      templateUrl: 'pages/templates/item_small.html',
      controller: 'SettingCtrl'
    })
  }])

  .controller('SettingCtrl', function ($scope, $routeParams, $rootScope, $location) {
    const items = [
      {
        id: 0,
        link: '#!/setting/wifi',
        src: "assets/images/wifi_m.png",
        name: 'WiFi'
      },
      {
        id: 1,
        link: '#!/setting/bluetooth',
        src: "assets/images/bluetooth_m.png",
        name: '蓝牙'
      },
      {
        id: 2,
        link: '#!/setting/microphone',
        src: "assets/images/microphone.png",
        name: '麦克风'
      },
      {
        id: 3,
        link: '#!/setting/speaker',
        src: "assets/images/volume.png",
        name: '扬声器'
      },
      {
        id: 4,
        link: '#!/setting/rosNode',
        src: "assets/images/node.png",
        name: '节点管理'
      },
      {
        id: 5,
        link: '#!/setting/deviceInfo',
        src: "assets/images/info.png",
        name: '设备信息'
      },
    ]
    $rootScope.title = '系统设置'
    $rootScope.items = items
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    // $scope.show = items
    $rootScope.updatePageInfo()
    console.log($rootScope)
  });