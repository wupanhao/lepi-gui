'use strict';

const KEY = {
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Enter: 13,
    M: 77, // KeyM (Menu)
    B: 66, // KeyB (Back)
    R: 82, // KeyR (Run)
    S: 83 // KeyS (Stop or Home)
}

// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.index',
    'myApp.testing',
    'myApp.9_axis',
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/index' });
    }])
    .controller('App', function ($scope, $rootScope, $location) {

        $rootScope.debug = false
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.go_back = function () {
            //此处使用js原生方式回退  
            history.back();
        }

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case KEY.ArrowLeft:
                    break;
                case KEY.ArrowRight:
                    break;
                case KEY.ArrowUp:
                    break;
                case KEY.ArrowDown:
                    break;
                case KEY.Enter:
                    break;
                case KEY.M:
                    break;
                case KEY.B:
                    break;
                case KEY.R:
                    break;
                case KEY.S:
                    break;
                default:
                    // console.log(e.keyCode, 'ignore keyup event', e)
                    break;
            }
            var path = $location.path()
            var name = 'keyEvent'+path
            console.log(name,$location.search())
            $scope.$broadcast(name,e)
        })

    })