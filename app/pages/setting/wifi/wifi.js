'use strict';

angular.module('myApp.wifi', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/wifi', {
            templateUrl: 'pages/setting/wifi/wifi.html',
            controller: 'WifiCtrl'
        });
    }])

    .controller('WifiCtrl', function ($scope, $http, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = 'WiFi'
        console.log($location.path(), ' entered')

        const updateWiFiList = () => {
            $http.get('/wifi/scan').then(res => {

                if ($location.path() != '/setting/wifi') {
                    return
                }

                // $scope.wifiList = res.data
                $rootScope.items = res.data.map(item => {
                    item.ssid = decodeURI(item.ssid.split('\\x').join('%'))
                    return item
                })
                $rootScope.rowNum = 6
                $rootScope.colNum = 1
                $rootScope.updatePageInfo()
            }, (err) => {
                console.log(err)
            })
        }
        const updateWiFiInfo = () => {
            $http.get('/wifi/info').then(res => {
                if (res.data && res.data.ssid) {
                    res.data.ssid = decodeURI(res.data.ssid.split('\\x').join('%'))
                }
                $scope.info = res.data
                ngRefresh()
            }, (err) => {
                console.log(err)
            })
        }

        const kb = new SoftKeyboard('#soft-keyboard')

        kb.onComplete = (passwd) => {
            const wifi = $rootScope.show[$rootScope.itemIndex]
            console.log(wifi, passwd)
            swal.fire({
                title: "正在连接",
                text: "请稍等",
                // icon: "/images/loading.gif",
                button: false,
                closeOnClickOutside: false,
                closeOnEsc: false
            });
            const ele = document.querySelector('#input')
            ele.classList.add('hide')
            $http.post('/wifi/connect', { ssid: wifi.ssid, psk: passwd }).then(res => {
                console.log(res.data)
                if (res.data && res.data.ssid) {
                    swal.fire({
                        title: "连接成功",
                        text: "",
                        button: false,
                        timer: 1000,
                    });
                } else {
                    swal.fire({
                        title: "连接失败",
                        text: "",
                        button: false,
                        timer: 1000,
                    });
                }
                setTimeout(updateWiFiInfo, 1000)

            }, err => {
                console.log(err)
                swal.fire({
                    title: "连接出错",
                    // text: "",
                    timer: 1000,
                    button: false,
                });
                // swal.stopLoading();
                // swal.close();
            })
        }
        $rootScope.localHandler[$location.path()] = (e) => {
            console.log(e.code)
            if ($rootScope.show.length == 0) {
                return false
            }
            const ele = document.querySelector('#input')
            if (ele && !(ele.classList.contains('hide'))) {
                if (kb.keyHandler(e)) {
                    return true
                }
            }
            switch (e.code) {
                case "Enter":
                    if (ele && ele.classList.contains('hide')) {
                        const wifi = $rootScope.show[$rootScope.itemIndex]
                        const title = document.querySelector('#input .title')
                        title.textContent = '连接到' + wifi.ssid
                        ele.classList.remove('hide')
                    }
                    break;
                case "KeyB":
                    if (ele && !(ele.classList.contains('hide'))) {
                        ele.classList.add('hide')
                    } else {
                        return false
                    }
                    break;
                default:
                    return false
            }
            return true
        }
        updateWiFiList()
        updateWiFiInfo()
    });

