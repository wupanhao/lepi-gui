'use strict';

angular.module('myApp.explore', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/explore', {
      templateUrl: 'pages/explore/explore.html',
      controller: 'ExploreCtrl'
    })
  }])

  .controller('ExploreCtrl', function ($rootScope, $http, $location) {
    $rootScope.show_header = true
    $rootScope.title = '文件管理'
    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    console.log('/explore page entered')

    var explorePages = []
    var dir = $location.search().dir || ''
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
        var url = '#!' + $location.path()
        var splitNames = item.split('.')
        var len = splitNames.length
        if (len > 1) {

          if (data.current && data.current.includes(":")) {
            var path = data.current + '\\' + item
          } else {
            var path = data.current + '/' + item
          }

          path = path.slice(data.homedir.length,path.length)
          path = path.replace('\\','/')

          var extName = splitNames[len - 1]
          switch (extName) {
            case 'mp3':
            case 'ogg':
            case 'wav':
            case 'm4a':
              imageUrl = 'assets/images/explore/music.png'
              url = encodeURI(`#!/player?src=/explore${path}`)
              break
            case 'mp4':
            case 'webm':
              imageUrl = 'assets/images/explore/video.png'
              url = encodeURI(`#!/player?src=/explore${path}`)
              break
            case 'sb3':
              imageUrl = 'assets/images/explore/file.png'
              url = encodeURI(`#!/scratchRunner?src=/explore${path}`)
              break
            case 'py':
              imageUrl = 'assets/images/explore/file.png'
              break
            case 'sh':
              imageUrl = 'assets/images/explore/file.png'
              break
          }

        }
        if (imageUrl) {
          explorePages.push({ link: url, src: imageUrl, name: item })
        }
      })
      if($location.path() == '/explore'){
        $rootScope.items = explorePages
        $rootScope.updatePageInfo()
      }else{
        console.log('/explore page exit')
      }


    }, (err) => {
      console.log(err)
    })



  });