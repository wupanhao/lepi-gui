'use strict';

angular.module('myApp.setting', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/setting', {
      templateUrl: 'pages/setting/setting.html',
      controller: 'IndexCtrl'
    });
  }])

  .controller('SettingCtrl', function ($scope, $routeParams, $rootScope) {

    const items = [
      {
        link: '#!explore',
        src: "assets/images/explore.png",
        name: '文件管理'
      },
      {
        link: '#!test',
        src: "assets/images/test.png",
        name: '内置测试'
      },
      {
        link: '#!variable',
        src: "assets/images/variable.png",
        name: '变量设置'
      },
      {
        link: '#!setting',
        src: "assets/images/setting.png",
        name: '系统设置'
      }
    ]

    $scope.items = items
    $scope.pageInfo = {
      itemIndex: 0,
      pageIndex: $routeParams.page | 0,
      pageNum: Math.ceil(items.length / 4)
    }
    var start = $scope.pageInfo.pageIndex * 4
    $scope.show = items.slice(start,start + 4).map((item,id) => {
      item.id = id
      return item
    })

    console.log($scope)
    $scope.click = (id) => {
      console.log(id)
      $scope.pageInfo.itemIndex = id
      console.log($scope.pageInfo)
    }
    $scope.$on('keyEvent/index', (name, e) => {
      console.log('index', e)
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