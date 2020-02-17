'use strict';

angular.module('myApp.index', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'pages/index/index.html',
      controller: 'IndexCtrl'
    });
  }])

  .controller('IndexCtrl', function ($http, $rootScope, $scope) {

    const items = [
      {
        link: '#!/explore',
        src: "assets/images/explore.png",
        name: '文件管理'
      },
      {
        link: '#!/testing',
        src: "assets/images/testing.png",
        name: '内置测试'
      },
      {
        link: '#!/variable',
        src: "assets/images/variable.png",
        name: '变量设置'
      },
      {
        link: '#!/setting',
        src: "assets/images/setting.png",
        name: '系统设置'
      }
    ]
    $rootScope.title = '乐派'
    $rootScope.items = items
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    $rootScope.menus = [
      {
        text: '关机',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal("正在关机", {
            button: false,
          });
          $http.get('/system/halt')
        }
      }, {
        text: '重启',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal("正在准备重启", {
            button: false,
          });
          $http.get('/system/reboot')
        }
      }, {
        text: '回到首页',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          window.location.assign('#!/index')
        }
      },
    ]

    console.log('index entered')
    $rootScope.updatePageInfo()
  });