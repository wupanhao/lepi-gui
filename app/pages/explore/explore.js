'use strict';

angular.module('myApp.testing', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/testing', {
      templateUrl: 'pages/templates/item_small.html',
      controller: 'TestingCtrl'
    })
  }])

  .controller('TestingCtrl', function ($scope, $routeParams, $rootScope, $location) {
    $rootScope.show_header = true
    $rootScope.title = '内置测试'

    const items = [
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

    const url = '/testing'
    const rowNum = 3
    const colNum = 2
    const maxItemsOnPage = rowNum * colNum
    console.log(url, ' entered')
    $scope.url = url
    $scope.items = items
    $scope.maxPageIndex = Math.ceil(items.length / maxItemsOnPage) - 1
    const updatePageInfo = (pageIndex) => {
      if (pageIndex >= 0 && pageIndex <= $scope.maxPageIndex) {
        var start = pageIndex * maxItemsOnPage
        $scope.show = items.slice(start, start + maxItemsOnPage)
        $scope.itemIndex = 0
        $scope.maxItemIndex = $scope.show.length - 1
        $scope.pageIndex = pageIndex
        $scope.maxRowIndex =  Math.ceil($scope.show.length / colNum) - 1
        if($scope.maxPageIndex > 0){
          $rootScope.pageInfo = `第${pageIndex+1}/${$scope.maxPageIndex+1}页`
        }else{
          $rootScope.pageInfo = " "
        }
      } else {
        console.log('page index:', pageIndex)
      }
    }
    updatePageInfo($location.search().page | 0)

    // console.log($scope)
    $scope.click = (id) => {
      $scope.itemIndex = id
      console.log(`url:${url},page:${$scope.pageIndex}/${$scope.maxPageIndex},item:${$scope.itemIndex}/${$scope.maxItemIndex}`)
    }
    $scope.$on('keyEvent' + url, (name, e) => {
      var i = $scope.itemIndex
      console.log(url, e)
      switch (e.keyCode) {
        case KEY.ArrowLeft:
          if (i % colNum == 0 && $scope.pageIndex > 0) { //翻页
            updatePageInfo($scope.pageIndex - 1)
            document.getElementsByClassName('card')[0].click(0)
            return
          } else {
            i = i > 0 ? i - 1 : i
          }
          break;
        case KEY.ArrowRight:
          if ((i % colNum == colNum - 1 || i == $scope.maxItemIndex) && $scope.pageIndex < $scope.maxPageIndex ) {//翻页
            updatePageInfo($scope.pageIndex + 1)
            document.getElementsByClassName('card')[0].click(0)
            return
          } else {
            i = i < $scope.maxItemIndex ? i + 1 : i
          }
          break;
        case KEY.ArrowUp:
          var row =  Math.floor(i/colNum)
          var col = i%colNum
          var rowi = row > 0 ? row -1 : $scope.maxRowIndex
          i = Math.min(rowi*colNum + col,$scope.maxItemIndex)
          break;
        case KEY.ArrowDown:
          var row =  Math.floor(i/colNum)
          var col = i%colNum
          var rowi = row < $scope.maxRowIndex ? row + 1 : 0
          i = Math.min(rowi*colNum + col,$scope.maxItemIndex)          
          break;
        case KEY.Enter:
          var link = $scope.show[i].link
          window.location.assign(link)
          break;
        case KEY.M:
          break;
        case KEY.R:
          break;
        case KEY.S:
          break;
      }
      if ($scope.itemIndex != i) {
        document.getElementsByClassName('card')[i].click(i)
      }
    })

  });