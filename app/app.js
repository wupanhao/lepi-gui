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
    'myApp.setting',
    'myApp.9_axis',
])
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({ redirectTo: '/index' });
    }])
    .controller('App', function ($rootScope, $location) {

        $rootScope.debug = false
        $rootScope.show_header = true
        $rootScope.show_footer = true

        $rootScope.go_back = function () {
            //此处使用js原生方式回退  
            history.back();
        }
        console.log('call only once')

        const updatePageInfo = (pageIndex = 0) => {
            $rootScope.maxItemsOnPage = $rootScope.rowNum * $rootScope.colNum
            $rootScope.maxPageIndex = Math.ceil($rootScope.items.length / $rootScope.maxItemsOnPage) - 1
            if (pageIndex >= 0 && pageIndex <= $rootScope.maxPageIndex) {
                console.log($location.path(), `page index ${pageIndex} entered`)
                var start = pageIndex * $rootScope.maxItemsOnPage
                $rootScope.show = $rootScope.items.slice(start, start + $rootScope.maxItemsOnPage)
                $rootScope.itemIndex = 0
                $rootScope.maxItemIndex = $rootScope.show.length - 1
                $rootScope.pageIndex = pageIndex
                $rootScope.maxRowIndex = Math.ceil($rootScope.show.length / $rootScope.colNum) - 1
                if ($rootScope.maxPageIndex > 0) {
                    $rootScope.pageInfo = `第${pageIndex + 1}/${$rootScope.maxPageIndex + 1}页`
                } else {
                    $rootScope.pageInfo = " "
                }
            } else {
                console.log('page index:', pageIndex)
            }
        }

        $rootScope.items = []
        $rootScope.rowNum = 3
        $rootScope.colNum = 2
        updatePageInfo($location.search().page | 0)

        $rootScope.updatePageInfo = updatePageInfo
        // console.log($rootScope)
        $rootScope.click = (id) => {
            $rootScope.itemIndex = id
            console.log(`url:${$location.path()},page:${$rootScope.pageIndex}/${$rootScope.maxPageIndex},item:${$rootScope.itemIndex}/${$rootScope.maxItemIndex}`)
        }
        document.addEventListener('keyup', (e) => {
            if ($rootScope.maxItemIndex >= 0) {
                var i = $rootScope.itemIndex
                switch (e.keyCode) {
                    case KEY.ArrowLeft:
                        if (i % $rootScope.colNum == 0 && $rootScope.pageIndex > 0) { //翻页
                            updatePageInfo($rootScope.pageIndex - 1)
                            var cards = document.getElementsByClassName('card')
                            cards[0] && cards[0].click(0)
                            return
                        } else {
                            i = i > 0 ? i - 1 : i
                        }
                        break;
                    case KEY.ArrowRight:
                        if ((i % $rootScope.colNum == $rootScope.colNum - 1 || i == $rootScope.maxItemIndex) && $rootScope.pageIndex < $rootScope.maxPageIndex) {//翻页
                            updatePageInfo($rootScope.pageIndex + 1)
                            var cards = document.getElementsByClassName('card')
                            cards[0] && cards[0].click(0)
                            return
                        } else {
                            i = i < $rootScope.maxItemIndex ? i + 1 : i
                        }
                        break;
                    case KEY.ArrowUp:
                        var row = Math.floor(i / $rootScope.colNum)
                        var col = i % $rootScope.colNum
                        var rowi = row > 0 ? row - 1 : $rootScope.maxRowIndex
                        i = Math.min(rowi * $rootScope.colNum + col, $rootScope.maxItemIndex)
                        break;
                    case KEY.ArrowDown:
                        var row = Math.floor(i / $rootScope.colNum)
                        var col = i % $rootScope.colNum
                        var rowi = row < $rootScope.maxRowIndex ? row + 1 : 0
                        i = Math.min(rowi * $rootScope.colNum + col, $rootScope.maxItemIndex)
                        break;
                    case KEY.Enter:
                        var link = $rootScope.show[i].link
                        window.location.assign(link)
                        break;
                }
                if ($rootScope.itemIndex != i) {
                    var cards = document.getElementsByClassName('card')
                    cards[i] && cards[i].click(i)
                }
            }
            switch (e.keyCode) {
                case KEY.M:
                    break;
                case KEY.B:
                    history.back();
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
            var name = 'keyEvent' + path
            // console.log(name, $location.search())
            $rootScope.$broadcast(name, e)

        })

        /*
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
                            history.back();
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
                    var name = 'keyEvent' + path
                    console.log(name, $location.search())
                    $rootScope.$broadcast(name, e)
                })
        */
    })