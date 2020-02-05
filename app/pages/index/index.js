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
        link: '#!explore',
        src: "assets/images/explore.png",
        name: '文件管理'
      },
      {
        link: '#!testing',
        src: "assets/images/testing.png",
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
    const pageIndex = $location.search().page | 0
    $scope.pageInfo = {
      itemIndex: 0,
      pageIndex: pageIndex,
      pageNum: Math.ceil(items.length / 4)
    }
    $scope.show = items.slice($scope.pageInfo.pageIndex * 4, 4).map((item,id) => {
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