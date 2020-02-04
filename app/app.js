'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.index',
    ])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/index' });
    }])
    .controller('MyApp', function($rootScope) {
        $rootScope.debug = false
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.go_back = function() {
            //此处使用js原生方式回退  
            history.back();
        }
    })