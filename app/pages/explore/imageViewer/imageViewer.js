'use strict';

angular.module('myApp.imageViewer', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/imageViewer', {
            templateUrl: 'pages/explore/imageViewer/imageViewer.html',
            controller: 'ImageViewerCtrl'
        })
    }])

    .controller('ImageViewerCtrl', function ($rootScope, $scope, $location) {
        $rootScope.show_header = true
        $rootScope.title = '图片预览'
        $rootScope.items = []

        var src = $location.search().src || ''
        const img = document.getElementById('viewer')
        img.src = src

        $rootScope.localMenus[$location.path()] = [
            {
                text: '全屏',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    const img = document.querySelector('#viewer')
                    if (img.classList.contains('horizontal')) {
                        img.classList.remove('horizontal')
                    } else {
                        img.classList.add('horizontal')
                    }
                }
            },
        ]

        $rootScope.updatePageInfo()

    });