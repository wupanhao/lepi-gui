'use strict';

angular.module('myApp.rosNode', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/setting/rosNode', {
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
            swal.fire({
                title: "正在更新数据",
                text: "请稍等",
                showConfirmButton: false,
            });
            $http.get('/rosNode/status').then(res => {
                console.log(res.data)
                $scope.nodeInfo = res.data

                swal.close()
                if ($location.path() != '/setting/rosNode') {
                    // setTimeout(updateNodeStatus, 3000)
                    return
                }

                if ($rootScope.items.length == 0) {
                    $rootScope.items = Object.values(res.data)
                    $rootScope.updatePageInfo()
                } else {
                    $rootScope.items = Object.values(res.data)
                    if (!menuShown()) {
                        $rootScope.updatePageInfo($rootScope.pageIndex)
                        // ngRefresh()
                    }
                }
            }, (err) => {
                console.log(err)
            })
        }

        const syncToggleState = () => {
            var start = $rootScope.pageIndex * $rootScope.maxItemsOnPage
            let show = $rootScope.items.slice(start, start + $rootScope.maxItemsOnPage)
            console.log($rootScope.show)
            for (let index = 0; index < $rootScope.show.length; index++) {
                console.log(show[index].auto_start, $scope.elements[index].MaterialSwitch.inputElement_.checked)
                if (show[index].auto_start != $scope.elements[index].MaterialSwitch.inputElement_.checked) {
                    if (show[index].auto_start) {
                        $scope.elements[index].MaterialSwitch.on()
                    } else {
                        $scope.elements[index].MaterialSwitch.off()
                    }
                    $rootScope.show[index].auto_start = $scope.elements[index].MaterialSwitch.inputElement_.checked
                }
            }
        }

        $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
            console.log(ngRepeatFinishedEvent)
            window.componentHandler.upgradeAllRegistered()
            $scope.elements = document.querySelectorAll('.mdl-switch')

            syncToggleState()
            console.log($scope.elements)
        });

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
                        swal.fire('节点已启动')
                        setTimeout(swal.close, 1000)
                        return
                    }
                    swal.fire('启动中，请稍等')
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
                        swal.fire('节点未启动')
                        setTimeout(swal.close, 1000)
                        return
                    }
                    swal.fire('正在关闭节点')
                    $http.get(`/rosNode/kill?name=${name}`).then(res => {
                        const data = res.data
                        if (data.code == 0) {
                            swal.fire('已停止')
                            updateNodeStatus()
                            setTimeout(swal.close, 1000)
                        }
                    })
                }
            }
        ]

        const localHandler = (e) => {
            var i = $rootScope.itemIndex
            switch (e.code) {
                case "Enter":
                    if ($scope.elements[i].MaterialSwitch.inputElement_.checked) {
                        $http.get(`/rosNode/disable?name=${$rootScope.show[i].name}`).then(res => {
                            $rootScope.items = Object.values(res.data)
                            syncToggleState()
                        })
                    } else {
                        $http.get(`/rosNode/enable?name=${$rootScope.show[i].name}`).then(res => {
                            $rootScope.items = Object.values(res.data)
                            syncToggleState()
                        })
                    }
                    break;
                default:
                    return false
            }
            return true
        }

        $rootScope.localHandler[$location.path()] = localHandler

        updateNodeStatus()
    });

