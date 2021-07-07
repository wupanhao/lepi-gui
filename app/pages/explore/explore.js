'use strict';

angular.module('myApp.explore', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/explore', {
            templateUrl: 'pages/explore/explore.html',
            controller: 'ExploreCtrl'
        })
    }])

    .controller('ExploreCtrl', function ($rootScope, $http, $location, $scope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '文件管理'
        $rootScope.rowNum = 3
        $rootScope.colNum = 2
        console.log('/explore page entered')
        $rootScope.items = []
        $rootScope.updatePageInfo()
        var explorePages = []
        var dir = $location.search().dir || ''

        function pageInit() {

            $http.get('/explore?dir=' + dir).then(res => {
                var data = res.data
                data && data.dirs && data.dirs.map(item => {
                    if (item[0] == '.') {
                        return
                    } else {
                        if (data.current && data.current.includes(":")) {
                            var path = data.current + '\\' + item
                        } else {
                            var path = data.current + '/' + item
                        }
                        explorePages.push({ link: `#!/explore?dir=${encodeURI(path)}`, src: `assets/themes/${iconTheme}/icon-folder.png`, name: item })
                    }
                })
                data && data.files && data.files.map(item => {
                    var imageUrl = null
                    // var url = '#!' + $location.path()
                    var url = null
                    var api = null
                    var splitNames = item.split('.')
                    var len = splitNames.length
                    if (len > 1) {

                        if (data.current && data.current.includes(":")) {
                            var path = data.current + '\\' + item
                        } else {
                            var path = data.current + '/' + item
                        }

                        var url_path = path.slice(data.homedir.length, path.length)
                        url_path = url_path.replace('\\', '/')

                        var extName = splitNames[len - 1].toLowerCase()
                        switch (extName) {
                            case 'mp3':
                            case 'ogg':
                            case 'oga':
                            case 'wav':
                            case 'm4a':
                                imageUrl = `assets/themes/${iconTheme}/icon-mp3.png`
                                url = encodeURI(`#!/player?src=/explore${url_path}`)
                                break
                            case 'mp4':
                            case 'ogv':
                            case 'webm':
                                imageUrl = `assets/themes/${iconTheme}/icon-mp4.png`
                                url = encodeURI(`#!/player?src=/explore${url_path}`)
                                break
                            case 'sb3':
                                imageUrl = `assets/themes/${iconTheme}/icon-scratch.png`
                                url = encodeURI(`#!/scratchRunner?src=/explore${url_path}`)
                                break
                            case 'py':
                                imageUrl = `assets/themes/${iconTheme}/icon-python.png`
                                api = encodeURI(`/system/execFile?path=${path}`)
                                break
                            case 'sh':
                                imageUrl = `assets/themes/${iconTheme}/icon-shell.png`
                                api = encodeURI(`/system/execFile?path=${path}`)
                                break
                            case 'js':
                                imageUrl = `assets/themes/${iconTheme}/icon-shell.png`
                                api = encodeURI(`/system/execFile?path=${path}`)
                                break
                            case 'png':
                            case 'jpg':
                            case 'svg':
                            case 'bmp':
                            case 'webp':
                            case 'jpeg':
                            case 'gif':
                                imageUrl = `/explore${url_path}`
                                url = encodeURI(`#!/imageViewer?src=/explore${url_path}`)
                                break
                            case 'nes':
                                imageUrl = `assets/themes/${iconTheme}/games-nes.jpg`
                                url = encodeURI(`/app/pages/explore/fceux?game=/explore${url_path}`)
                                break
                        }
                    }
                    if (url) {
                        explorePages.push({ link: url, src: imageUrl, name: item })
                    } else if (api) {
                        explorePages.push({ link: url, src: imageUrl, name: item, api: api })
                    }
                })
                if ($location.path() == '/explore') {
                    if (explorePages.length == 0) {
                        const ele = document.querySelector('.blank')
                        if (ele) {
                            ele.textContent = '空目录'
                        }
                    } else {
                        $rootScope.items = explorePages
                        $rootScope.updatePageInfo()
                    }

                } else {
                    console.log('/explore page exit')

                }


            }, (err) => {
                console.log(err)
                $rootScope.items = explorePages
                $rootScope.updatePageInfo()
            })
        }
        $rootScope.localMenus[$location.path()] = [
            {
                text: '资源目录',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    window.location.assign('#!/explore')
                }
            }, {
                text: '家目录',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    window.location.assign('#!/explore?dir=/home/pi')
                }
            }, {
                text: '根目录',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    window.location.assign('#!/explore?dir=/')
                }
            },
        ]

        pageInit()
    });