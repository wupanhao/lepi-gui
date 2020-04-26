'use strict';

angular.module('myApp.rosNode', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/rosNode/', {
            templateUrl: 'pages/setting/rosNode/rosNode.html',
            controller: 'NodeCtrl'
        });
    }])

    .controller('NodeCtrl', function ($scope, $http, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '节点管理'
        $rootScope.rowNum = 6
        $rootScope.colNum = 1
        $rootScope.items = []
        $rootScope.show = []
        console.log($location.path(), ' entered')

        const updateNodeStatus = () => {
            // swal('正在更新数据')
            swal({
                title: "正在更新数据",
                text: "请稍等",
                button: false,
            });
            $http.get('/rosNode/status').then(res => {
                console.log(res.data)
                $scope.nodeInfo = res.data
                if ($rootScope.items.length == 0) {
                    $rootScope.items = Object.values(res.data)
                    $rootScope.updatePageInfo()
                } else {
                    $rootScope.show = Object.values(res.data)
                    if (!menuShown()) {
                        ngRefresh()
                    } 
                }
                swal.close()

                if ($location.path() == '/setting/rosNode/') {
                    // setTimeout(updateNodeStatus, 3000)
                }
            }, (err) => {
                console.log(err)
            })
        }

        $rootScope.localMenus[$location.path()] = [
            {
                text: '刷新',
                callback: () => {
                    updateNodeStatus()
                }
            },
            {
                text: '启动',
                callback: () => {
                    const i = $rootScope.itemIndex
                    const name = $rootScope.show[i].name
                    console.log('启动' + name)
                    if ($rootScope.show[i].status != '已停止') {
                        swal('节点已启动')
                        setTimeout(swal.close, 1000)
                        return
                    }
                    swal('启动中，请稍等')
                    $http.get(`/rosNode/launch?name=${name}`).then(res => {
                        const data = res.data
                        if (data.code == 0) {
                            updateNodeStatus()
                            setTimeout(swal.close, 1000)
                        }
                    })
                }
            },
            {
                text: '停止',
                callback: () => {
                    const i = $rootScope.itemIndex
                    const name = $rootScope.show[i].name
                    console.log('停止' + name)
                    if ($rootScope.show[i].status != '已启动') {
                        swal('节点未启动')
                        setTimeout(swal.close, 1000)
                        return
                    }
                    swal('正在关闭节点')
                    $http.get(`/rosNode/kill?name=${name}`).then(res => {
                        const data = res.data
                        if (data.code == 0) {
                            swal('已停止')
                            updateNodeStatus()
                            setTimeout(swal.close, 1000)
                        }
                    })
                }
            }
        ]


        updateNodeStatus()
    });

