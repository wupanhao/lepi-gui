'use strict';

angular.module('myApp.audio', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/audio', {
            templateUrl: 'pages/setting/audio/audio.html',
            controller: 'AudioCtrl'
        });
    }])

    .controller('AudioCtrl', function ($scope, $http, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '音频'
        console.log($location.path(), ' entered')
        $scope.devices = []
        $scope.deviceName = {
            'microphone': '麦克风',
            'speaker': '外放',
            'headphone': '耳机'
        }
        $rootScope.items = ['microphone', 'speaker', 'headphone']
        $rootScope.rowNum = 6
        $rootScope.colNum = 1

        $rootScope.localMenus[$location.path()] = [
            {
                text: '重置音频选项',
                callback: (index) => {
                    $http.get('/system/reset_soundrc').then(res => {
                        swal.fire(res.data.msg, {
                            button: false,
                            timer: 1000,
                        })
                        // swal.fire({
                        //     title: "启动完毕",
                        //     text: "可以开始你的创作了",
                        // });
                    }, (err) => {
                        console.log(err)
                    })
                }
            },
        ]


        $rootScope.updatePageInfo()
        const updatePageInfo = () => {
            $http.get('/system/audio').then(res => {
                $scope.devices = res.data
                $rootScope.updatePageInfo()
            }, (err) => {
                console.log(err)
            })
        }

        const setVolume = (dev, value) => {
            $http.get(`/system/audio?dev=${dev}&value=${value}`).then(res => {
                Object.assign($scope.devices, res.data)
                ngRefresh()
            }, (err) => {
                console.log(err)
            })
        }

        $rootScope.localHandler[$location.path()] = (e) => {
            console.log(e.code)
            if ($rootScope.show.length == 0) {
                return false
            }
            const i = $rootScope.itemIndex
            var volume = $scope.devices[$rootScope.items[i]]
            switch (e.code) {
                case "Enter":
                    console.log('should mute')
                    break;
                case "ArrowLeft":

                    if (volume > 0) {
                        volume = volume - 8
                        setVolume($rootScope.items[i], volume)
                    }
                    break;
                case "ArrowRight":
                    if (volume < 100) {
                        volume = volume + 8
                        setVolume($rootScope.items[i], volume)
                    }
                    break;
                default:
                    return false
            }
            return true
        }
        updatePageInfo()
    });

