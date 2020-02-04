'use strict';

angular.module('myApp.index', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/index', {
    templateUrl: 'pages/index/index.html',
    controller: 'IndexCtrl'
  });
}])

.controller('IndexCtrl', function($scope,$routeParams,$rootScope) {
  $scope.test = $routeParams.test
  $rootScope.test = $routeParams.test + 1
  console.log($routeParams)
});