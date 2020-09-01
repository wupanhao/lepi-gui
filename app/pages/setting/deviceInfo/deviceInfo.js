'use strict';

function secondsTotimePast(seconds) {
    const m_total = Math.floor(seconds / 60)
    const h_total = Math.floor(m_total / 60)
    const d_total = Math.floor(h_total / 60)
    return `${d_total}天${h_total % 24}时${m_total % 60}分`
}

angular.module('myApp.deviceInfo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/deviceInfo', {
            templateUrl: 'pages/setting/deviceInfo/deviceInfo.html',
            controller: 'DeviceInfoCtrl'
        })
    }])

    .controller('DeviceInfoCtrl', function ($scope, $http, $rootScope, $location) {
        const items = []
        $rootScope.title = '设备信息'
        $rootScope.items = items
        $rootScope.rowNum = 3
        $rootScope.colNum = 2
        $rootScope.show_header = $rootScope.show_footer = true
        // $scope.show = items
        $rootScope.updatePageInfo()

        var updatePageData = () => {
            $http.get('/system/deviceInfo').then(res => {
                res.data.uptime = secondsTotimePast(res.data.uptime)
                res.data.loadavg = res.data.loadavg.map(n => n.toFixed(2)).join(',')
                $scope.info = res.data
                ngRefresh()
                if ($location.path() == '/setting/deviceInfo') {
                    setTimeout(updatePageData, 3000)
                }
            })
        }

        $rootScope.ros.getFirmwareVersion().then(version => {
            $scope.firmware_version = version
            updatePageData()
        })

    });