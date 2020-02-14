'use strict';

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
                $scope.info = res.data
                ngRefresh()
                if ($location.path() == '/setting/deviceInfo') {
                    setTimeout(updatePageData, 3000)
                }
            })
        }

        updatePageData()
    });