'use strict';

angular.module('myApp.bluetooth', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/bluetooth', {
            templateUrl: 'pages/setting/bluetooth/bluetooth.html',
            controller: 'BluetoothCtrl'
        });
    }])

    .controller('BluetoothCtrl', function ($http, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '蓝牙'
        console.log($location.path(), ' entered')
        $rootScope.items = []
        $rootScope.rowNum = 6
        $rootScope.colNum = 1
        $rootScope.updatePageInfo()
        const updateBluetoothList = () => {
            $http.get('/bluetooth/devices').then(res => {
                console.log(res.data)
                if ($location.path() == '/setting/bluetooth') {
                    $rootScope.items = Object.values(res.data)
                    $rootScope.updatePageInfo()
                }
            }, (err) => {
                console.log(err)
            })
        }

        function connect() {
            const item = $rootScope.show[$rootScope.itemIndex]
            $http.get(`/bluetooth/connect?mac=${item.mac}`).then(res => {
                if (res.data && res.data.code == 0) {
                    swal.fire({
                        title: '连接中',
                        // text: "",
                        timer: 1000,
                        button: false,
                    });
                }
                updateBluetoothList()
            })
        }

        function disconnect() {
            const item = $rootScope.show[$rootScope.itemIndex]
            $http.get(`/bluetooth/disconnect?mac=${item.mac}`).then(res => {
                if (res.data && res.data.code == 0) {
                    swal.fire({
                        title: '断开中',
                        // text: "",
                        timer: 1000,
                        button: false,
                    });
                }
                updateBluetoothList()
            })
        }

        function scan() {
            console.log('startScan')
            $http.get(`/bluetooth/startScan`).then(res => {
                if (res.data && res.data.code == 0) {
                    swal.fire({
                        title: '正在重新扫描，请稍等',
                        // text: "",
                        timer: 1000,
                        button: false,
                    });
                }
                updateBluetoothList()
            })
        }
        function restartBluetooth() {
            $http.get(`/bluetooth/restart`).then(res => {
                if (res.data && res.data.code == 0) {
                    swal.fire({
                        title: '正在重启蓝牙，请稍等',
                        // text: "",
                        timer: 1000,
                        button: false,
                    });
                }
                updateBluetoothList()
            })
        }

        $rootScope.localMenus[$location.path()] = [
            {
                text: '连接',
                callback: () => {
                    connect()
                }
            },
            {
                text: '断开',
                callback: () => {
                    disconnect()
                }
            },
            {
                text: '重新扫描',
                callback: scan
            },
            {
                text: '重启蓝牙',
                callback: () => {
                    restartBluetooth()
                }
            }, {
                text: '刷新',
                callback: updateBluetoothList
            },
        ]
        updateBluetoothList()
    });

