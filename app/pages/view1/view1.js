'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1/:test', {
            templateUrl: 'pages/view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($scope, $routeParams, $rootScope) {
        $scope.test = $routeParams.test
        $rootScope.test = $routeParams.test + 1
        console.log($routeParams)

        function update() {
            setTimeout(() => {
                console.log(window.location);
                update()
            }, 1000)
        }
        update()
    });