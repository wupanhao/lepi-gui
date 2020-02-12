'use strict';

angular.module('myApp.wifi', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/wifi/', {
            templateUrl: 'pages/setting/wifi/wifi.html',
            controller: 'WifiCtrl'
        });
    }])

    .controller('WifiCtrl', function ($scope, $http, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = 'WiFi'
        console.log($location.path(), ' entered')

        $http.get('/wifi/scan').then(res => {
            // $scope.wifiList = res.data
            $rootScope.items = res.data
            $rootScope.rowNum = 6
            $rootScope.colNum = 1
            $rootScope.updatePageInfo()
        }, (err) => {
            console.log(err)
        })
        $http.get('/wifi/info').then(res => {
            $scope.info = res.data
            ngRefresh()
        }, (err) => {
            console.log(err)
        })
    });