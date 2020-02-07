'use strict';

angular.module('myApp.player', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/player', {
      templateUrl: 'pages/explore/player/player.html',
      controller: 'PlayerCtrl'
    })
  }])

  .controller('PlayerCtrl', function ($rootScope, $scope, $location) {
    $rootScope.show_header = true
    $rootScope.title = '播放器'

    var src = $location.search().src || ''
    const player = document.getElementById('player')
    player.src = src
    $rootScope.items = []
    $rootScope.updatePageInfo()

    $scope.$on('keyEvent' + $location.path(), (name, e) => {
      console.log(e)
      switch (e.keyCode) {
        case KEY.ArrowLeft:
          player.currentTime -= 10
          break
        case KEY.ArrowRight:
          player.currentTime += 10
          break
        case KEY.ArrowUp:
          player.volume = Math.min(player.volume + 0.1, 1)
          break
        case KEY.ArrowDown:
          player.volume = Math.max(player.volume - 0.1, 0)
          break
        case KEY.Enter:
          if (player.paused) {
            player.play()
          } else {
            player.pause()
          }
        case KEY.M:
        case KEY.B:
        case KEY.R:
        case KEY.S:
          break;
        default:
          // console.log(e.keyCode, 'ignore keyup event', e)
          break;
      }
    })

  });