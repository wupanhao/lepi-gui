'use strict';
function setOutAudioDevices(element, deviceId) {
    return new Promise((resolve, reject) => {
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(deviceId)
                .then(() => {
                    resolve(`Success, audio output device attached: ${deviceId} to element with ${element.title} as source.`)
                })
                .catch(error => {
                    let errorMessage = error
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`
                    }
                    reject(errorMessage)
                })
        } else {
            reject(new Error('Browser does not support output device selection.'))
        }
    })
}

class Piano {

    constructor() {
        this.audioContext = audioContext
    }

    /**
     * play the musical note
     *
     * @param {number} frequency
     */
    play(frequency) {
        if (!this.audioContext) {
            return
        }
        if (this.oscillator) {
            this.stop()
        }
        this.oscillator = this.audioContext.createOscillator()
        this.oscillator.connect(this.audioContext.destination)
        this.oscillator.start()
        this.oscillator.frequency.value = frequency
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            this.timer = null
            this.stop()
        }, 800)
    }

    stop() {
        this.oscillator && this.oscillator.stop()
        this.oscillator = null
    }
}
const PianoFreq = {
    1: 261,
    2: 293,
    3: 330,
    4: 349,
    5: 392,
    6: 440,
    7: 494
}

const piano = new Piano()

angular.module('myApp.speaker', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/speaker', {
            templateUrl: 'pages/testing/speaker/speaker.html',
            // template: '<video src=""></video>',
            controller: 'SpeakerCtrl'
        });
    }])

    .controller('SpeakerCtrl', function ($location, $rootScope, $scope) {
        $rootScope.setStatusBar(true)
        $rootScope.items = []
        $rootScope.title = '扬声器测试'

        navigator.mediaDevices.enumerateDevices().then(devices => {
            const speakerDevices = devices.filter(device => device.kind == 'audiooutput')
            console.log(speakerDevices)
            $rootScope.localMenus[$location.path()] = speakerDevices.map((device, index) => {
                return {
                    text: device.label || '扬声器 ' + index,
                    callback: () => {
                        if ($scope.currentStream) {
                        }
                        const audio = document.querySelector('audio')
                        setOutAudioDevices(audio, device.deviceId)
                    }
                }
            })
            $rootScope.updatePageInfo()

        });
        $scope.$on('$routeChangeStart', function ($event, next, current) {
            // console.log('$routeChangeStart', $event, next, current)
            if ($scope.currentStream) {
            }
        });

        // return
        const constraints = { audio: true };
        console.log(constraints)
        navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
            // const audio = document.querySelector('audio')
            console.log('getUserMedia:', mediaStream)
            mediaStream.getTracks().forEach(track => {
                track.stop();
            });
        }).catch(function (err) {
            console.log(err.name + ": " + err.message);
        });

        const localHandler = (e) => {
            switch (e.code) {
                case "ArrowUp":
                    piano.play(PianoFreq[1])
                    break;
                case "ArrowLeft":
                    piano.play(PianoFreq[2])
                    break;
                case "Enter":
                    piano.play(PianoFreq[3])
                    break;
                case "ArrowRight":
                    piano.play(PianoFreq[4])
                    break;
                case "KeyR":
                    piano.play(PianoFreq[5])
                    break;
                case "ArrowDown":
                    piano.play(PianoFreq[6])
                    break;
                case "KeyS":
                    piano.play(PianoFreq[7])
                    break;
                default:
                    return false
            }
            return true
        }

        $rootScope.localHandler['/testing/speaker'] = localHandler


    });