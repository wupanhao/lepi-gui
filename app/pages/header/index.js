'use strict';

angular.module('myApp.header', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/header', {
    templateUrl: 'pages/header/header.html',
    controller: 'HeaderCtrl'
  });
}])

.controller('HeaderCtrl', function($scope,$rootScope) {
  $rootScope.title = 'Lepi'
});