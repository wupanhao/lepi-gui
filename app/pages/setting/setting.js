'use strict';

angular.module('myApp.setting', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/setting', {
      templateUrl: 'pages/templates/item_small.html',
      controller: 'SettingCtrl'
    })
  }])

  .controller('SettingCtrl', function ($scope, $http, $rootScope, $location) {
    const items = [
      {
        id: 0,
        link: '#!/setting/wifi',
        src: `assets/themes/${iconTheme}/icon-wifi.png`,
        name: 'WiFi'
      },
      {
        id: 1,
        link: '#!/setting/bluetooth',
        src: `assets/themes/${iconTheme}/icon-bluetooth.png`,
        name: '蓝牙'
      },
      {
        id: 3,
        link: '#!/setting/audio',
        src: `assets/themes/${iconTheme}/icon-audio.png`,
        name: '音频'
      },
      {
        id: 4,
        link: '#!/setting/rosNode',
        src: `assets/themes/${iconTheme}/icon-node.png`,
        name: '节点管理'
      },
      {
        id: 5,
        link: '#!/setting/deviceInfo',
        src: `assets/themes/${iconTheme}/icon-info.png`,
        name: '设备信息'
      },
    ]
    $rootScope.title = '系统设置'
    $rootScope.items = items
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    // $scope.show = items

    $rootScope.localMenus[$location.path()] = [
      {
        text: '扩展系统分区',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          $http.get('/system/expand_rootfs').then(res => {
            var data = res.data
            if (data && data.msg) {
              swal({
                title: data.msg,
                text: "",
                button: false,
                timer: 1000,
              });
            }
          })
        }
      }, {
        text: '系统更新',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal({
            title: '正在检查更新',
            text: "请稍等",
            button: false,
          });
          $http.get('/system/update').then(res => {
            var data = res.data
            if (data && data.msg) {
              swal({
                title: data.msg,
                text: "",
                button: false,
                timer: 1000,
              });
            }
          })
        }
      },

    ]

    $rootScope.updatePageInfo()
    console.log($rootScope)
  });