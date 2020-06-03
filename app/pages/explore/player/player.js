'use strict';

function playMP3(url) {
  // Create a buffer for the incoming sound content
  var source = audioContext.createBufferSource();
  // Create the XHR which will grab the audio contents
  var request = new XMLHttpRequest();
  // Set the audio file src here
  request.open('GET', url, true);
  // Setting the responseType to arraybuffer sets up the audio decoding
  request.responseType = 'arraybuffer';
  request.onload = function () {
    // Decode the audio once the require is complete
    audioContext.decodeAudioData(request.response, function (buffer) {
      source.buffer = buffer;
      // Connect the audio to source (multiple audio buffers can be connected!)
      source.connect(audioContext.destination);
      // Simple setting for the buffer
      source.loop = false;
      // Play the sound!
      source.start(0);
    }, function (e) {
      console.log('Audio error! ', e);
    });
  }
  // Send the request which kicks off 
  request.send();
}
function playAudio(ele) {
  // Create a buffer for the incoming sound content
  var source = audioContext.createMediaElementSource(ele);
  document.source = source
  console.log(source)
  source.connect(audioContext.destination);
  // Simple setting for the buffer
  source.loop = false;
  // Play the sound!
  // source.play(0);
}

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
    const audioNode = document.getElementById('player')
    const source = audioContext.createMediaElementSource(audioNode)
    audioNode.src = src
    // document.audioEngine.playMP3(src)
    // playAudio(audioNode)

    audioNode.addEventListener("canplay", function (event) {
      console.log(event.type);
      source.connect(audioContext.destination);
      // audioNode.play();
    });

    audioNode.load();

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
          audioNode.currentTime -= 10
          break
        case "ArrowRight":
          audioNode.currentTime += 10
          break
        case "ArrowUp":
          audioNode.volume = Math.min(audioNode.volume + 0.1, 1)
          break
        case "ArrowDown":
          audioNode.volume = Math.max(audioNode.volume - 0.1, 0)
          break
        case "Enter":
          if (audioNode.paused) {
            audioNode.play()
          } else {
            audioNode.pause()
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