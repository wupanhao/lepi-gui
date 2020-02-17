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

    $rootScope.menus = [
      {
        text: '全屏',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          const video = document.querySelector('video')
          if (video.classList.contains('horizontal')) {
            video.classList.remove('horizontal')
          } else {
            video.classList.add('horizontal')
          }
        }
      },
    ]

    $rootScope.updatePageInfo()

    $rootScope.localHandler[$location.path()] = (e) => {
      console.log(e.code)
      switch (e.code) {
        case "ArrowLeft":
          player.currentTime -= 10
          break
        case "ArrowRight":
          player.currentTime += 10
          break
        case "ArrowUp":
          player.volume = Math.min(player.volume + 0.1, 1)
          break
        case "ArrowDown":
          player.volume = Math.max(player.volume - 0.1, 0)
          break
        case "Enter":
          if (player.paused) {
            player.play()
          } else {
            player.pause()
          }
          break
        case "KeyM":
        case "KeyB":
        case "KeyR":
        case "KeyS":
        default:
          return false
          // console.log(e.keyCode, 'ignore keyup event', e)
          break;
      }
      return true
    }

  });