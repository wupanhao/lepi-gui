'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'pages/view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', [function() {
    function update() {
        setTimeout(() => {
            console.log(window.location);
            update()
        }, 1000)
    }
    update()
}]);