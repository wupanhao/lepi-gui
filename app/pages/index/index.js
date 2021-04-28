'use strict';

angular.module('myApp.index', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'pages/index/index.html',
      controller: 'IndexCtrl'
    });
  }])

  .controller('IndexCtrl', function ($http, $rootScope, $location) {

    const items = [
      {
        link: '#!/explore',
        src: `assets/themes/${iconTheme}/icon-folder.png`,
        name: '文件管理'
      },
      {
        link: '#!/testing',
        src: `assets/themes/${iconTheme}/icon-testing.png`,
        name: '内置测试'
      },
      {
        link: '#!/variable',
        src: `assets/themes/${iconTheme}/icon-variable.png`,
        name: '变量设置'
      },
      {
        link: '#!/setting',
        src: `assets/themes/${iconTheme}/icon-setting.png`,
        name: '系统设置'
      }
    ]
    $rootScope.title = '乐派'
    $rootScope.items = items
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    $rootScope.localMenus[$location.path()] = [
      {
        text: '重新载入',
        callback: (index) => {
          window.location.reload(true);
        }
      },
      {
        text: '关机',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal.fire({
            title: "正在关机",
            showConfirmButton: false,
          });
          axios.get('/system/halt')
          // window.ros.systemPoweroff().then(() => {
          //   console.log('systemPoweroff responsed')
          //   clearTimeout(timer)
          // })
        }
      }, {
        text: '重启',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal.fire({
            title: "正在准备重启",
            showConfirmButton: false,
          });
          $http.get('/system/reboot')
        }
      }
    ]

    console.log('index entered')
    $rootScope.updatePageInfo()
  });