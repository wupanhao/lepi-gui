'use strict';

angular.module('myApp.index', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'pages/index/index.html',
      controller: 'IndexCtrl'
    });
  }])

  .controller('IndexCtrl', function ($scope, $location, $rootScope) {

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
    $rootScope.menus = ['菜单', '菜单', '菜单', '菜单', '菜单', '菜单',].map((item, index) => {
      return {
        text: item + index,
        callback: () => {
          var k = index
          console.log(`menu item-${k} clicked`)
        }
      }
    })

    console.log('index entered')
    $rootScope.updatePageInfo()
  });