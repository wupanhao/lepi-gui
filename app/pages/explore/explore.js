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
                        explorePages.push({ link: `#!/explore?dir=${encodeURI(path)}`, src: 'assets/images/explore/folder.png', name: item })
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

                        var extName = splitNames[len - 1]
                        switch (extName) {
                            case 'mp3':
                            case 'ogg':
                            case 'wav':
                            case 'm4a':
                                imageUrl = 'assets/images/explore/audio-x-generic.png'
                                url = encodeURI(`#!/player?src=/explore${url_path}`)
                                break
                            case 'mp4':
                            case 'webm':
                                imageUrl = 'assets/images/explore/video-x-generic.png'
                                url = encodeURI(`#!/player?src=/explore${url_path}`)
                                break
                            case 'sb3':
                                imageUrl = 'assets/images/explore/file.png'
                                url = encodeURI(`#!/scratchRunner?src=/explore${url_path}`)
                                break
                            case 'py':
                                imageUrl = 'assets/images/explore/file.png'
                                api = encodeURI(`/system/execFile?path=${path}`)
                                break
                            case 'sh':
                                imageUrl = 'assets/images/explore/text-x-script.png'
                                api = encodeURI(`/system/execFile?path=${path}`)
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
                    $rootScope.items = explorePages
                    $rootScope.updatePageInfo()
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