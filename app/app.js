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

function ngRefresh() {
    // $scope.apply()
    const header = document.getElementById('head')
    header.click()
}
function menuShown() {
    // $scope.apply()
    const menu = document.getElementById('demo-menu-list')
    // console.log('menuShown ', menu.dataset.show, typeof menu.dataset.show, menu.dataset.show == true)
    if (menu && menu.MaterialMenu.container_.classList.contains('is-visible')) {
        return true
    } else {
        return false
    }
}

function showMenu() {
    const menu = document.getElementById('demo-menu-top-left')
    if (!menuShown()) {
        menu.click()
        changeMenuActive(0)
    }
}
function closeMenu() {
    const menu = document.getElementById('demo-menu-top-left')
    if (menuShown()) {
        menu.click()
    }
}
function changeMenuActive(j) {
    const items = document.querySelectorAll('.mdl-menu__item')
    // console.log(`changeMenuActive ${j}`)
    items.forEach((item, index) => {
        // console.log(item, index, j)
        if (j == index) {
            item.classList.add('active')
        } else {
            item.classList.remove('active')
        }
    })
}


// Declare app level module which depends on views, and core components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.index',
    'myApp.explore',
    'myApp.player',
    'myApp.scratchRunner',
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


        function clickHandlerForContent(e) {
            var i = $rootScope.itemIndex || 0
            switch (e.keyCode) {
                case KEY.ArrowLeft:
                    if (i % $rootScope.colNum == 0 && $rootScope.pageIndex > 0) { //翻页
                        updatePageInfo($rootScope.pageIndex - 1)
                        return
                    } else {
                        i = i > 0 ? i - 1 : i
                    }
                    break;
                case KEY.ArrowRight:
                    if ((i % $rootScope.colNum == $rootScope.colNum - 1 || i == $rootScope.maxItemIndex) && $rootScope.pageIndex < $rootScope.maxPageIndex) {//翻页
                        updatePageInfo($rootScope.pageIndex + 1)
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
                    if (i < $rootScope.show.length) {
                        var link = $rootScope.show[i].link
                        if (link) {
                            window.location.assign(link)
                            return
                        }
                    }
                    break;
            }
            if ($rootScope.itemIndex != i) {
                $rootScope.itemIndex = i
                console.log(`url:${$location.path()},page:${$rootScope.pageIndex}/${$rootScope.maxPageIndex},item:${$rootScope.itemIndex}/${$rootScope.maxItemIndex}`)
                ngRefresh()
            }
        }



        function clickHandlerForMenu(e) {
            var j = $rootScope.menuIndex || 0
            const menus = $rootScope.menus || []
            const maxMenuIndex = menus.length - 1
            if (maxMenuIndex < 0) {
                console.log('no menu items found')
                return
            }
            switch (e.keyCode) {
                case KEY.ArrowUp:
                    j = j > 0 ? j - 1 : maxMenuIndex
                    break;
                case KEY.ArrowDown:
                    j = j < maxMenuIndex ? j + 1 : 0
                    break;
                case KEY.Enter:
                    var item = $rootScope.menus[j]
                    if (item && item.callback) {
                        item.callback()
                    }
                    break;
            }
            if (j != $rootScope.menuIndex) {
                $rootScope.menuIndex = j
                changeMenuActive(j)
            }
        }

        $rootScope.ngRefresh = ngRefresh

        $rootScope.go_back = function () {
            //此处使用js原生方式回退  
            history.back();
        }
        console.log('call only once')

        $rootScope.$on("$includeContentLoaded", function (event, templateName) {
            console.log(`${templateName} loaded`)
            if (templateName == 'pages/footer/footer.html') {
                // window.componentHandler.upgradeDom('MaterialMenu')
                window.componentHandler.upgradeAllRegistered()
            }
        });


        const updatePageInfo = (pageIndex = 0) => {
            if ($rootScope.loading == true) {
                console.log('page loading, return')
                return
            } else {
                $rootScope.loading == true
            }
            $rootScope.maxItemsOnPage = $rootScope.rowNum * $rootScope.colNum
            $rootScope.maxPageIndex = Math.ceil($rootScope.items.length / $rootScope.maxItemsOnPage) - 1
            if (pageIndex >= 0 && pageIndex <= $rootScope.maxPageIndex) {
                console.log($location.path(), `page index ${pageIndex} entered`)
                console.log($rootScope)
                $rootScope.show_header = true
                $rootScope.show_footer = true
                var start = pageIndex * $rootScope.maxItemsOnPage
                $rootScope.show = $rootScope.items.slice(start, start + $rootScope.maxItemsOnPage)
                $rootScope.itemIndex = 0
                $rootScope.maxItemIndex = $rootScope.show.length - 1
                $rootScope.pageIndex = pageIndex
                $rootScope.maxRowIndex = Math.ceil($rootScope.show.length / $rootScope.colNum) - 1
                if ($rootScope.maxPageIndex > 0) {
                    $rootScope.pageInfo = `${pageIndex + 1}/${$rootScope.maxPageIndex + 1}页`
                } else {
                    $rootScope.pageInfo = " "
                }
                ngRefresh()
            } else if ($rootScope.maxPageIndex == -1) {
                $rootScope.show = []
                $rootScope.pageInfo = " "
                console.log('blank page')
                ngRefresh()
            } else {
                console.log('page index error : ', pageIndex)
            }
            $rootScope.loading == false

        }

        $rootScope.items = []
        $rootScope.rowNum = 3
        $rootScope.colNum = 2
        updatePageInfo($location.search().page | 0)

        $rootScope.updatePageInfo = updatePageInfo
        // console.log($rootScope)

        $rootScope.click = (id) => {
            $rootScope.itemIndex = id
        }
        document.addEventListener('keyup', (e) => {
            if ($rootScope.maxItemIndex >= 0 && [KEY.ArrowLeft, KEY.ArrowRight, KEY.ArrowUp, KEY.ArrowDown, KEY.Enter].indexOf(e.keyCode) >= 0) {
                if (menuShown()) {
                    clickHandlerForMenu(e)
                } else {
                    clickHandlerForContent(e)
                }
            }
            switch (e.keyCode) {
                case KEY.M:
                    if (menuShown()) {
                        console.log('closeMenu')
                        closeMenu()
                    } else {
                        console.log('showMenu')
                        showMenu()
                    }
                    break;
                case KEY.B:
                    // console.log($location.path())
                    if (menuShown()) {
                        closeMenu()
                    } else if (['/player', '/scratchRunner'].indexOf($location.path()) >= 0) {
                        console.log('go back 2 pages')
                        history.go(-2);
                    } else {
                        console.log('go back')
                        history.back();
                    }
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
            // console.log(name, $rootScope)
            $rootScope.$broadcast(name, e)

        })
    })