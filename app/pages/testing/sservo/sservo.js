'use strict';

angular.module('myApp.sservo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/sservo', {
            templateUrl: 'pages/testing/sservo/sservo.html',
            controller: 'SservoCtrl'
        });
    }])

    .controller('SservoCtrl', function ($scope, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '智能舵机'
        $rootScope.items = []
        $rootScope.show = []
        $rootScope.pageIndex = 0
        $rootScope.rowNum = 5
        $rootScope.colNum = 1
        console.log($location.path(), ' entered')
        $scope.blanks = [{}, {}, {}, {}, {}]
        $scope.servos = []
        $scope.activeId = -1

        swal({
            title: "正在扫描舵机",
            text: "请稍等",
            button: false,
        });

        // $rootScope.updatePageInfo($rootScope.pageIndex)
        var active = (i) => {
            for (let index = 0; index < $scope.servos.length; index++) {
                const item = $scope.elements.rows[index];
                if (index == i) {
                    item.classList.add('active')
                    $scope.activeId = i
                } else {
                    item.classList.remove('active')
                }
            }
        }
        var updateData = () => {
            const ids = $rootScope.show.map(servo => servo.id)
            // console.log('updateData:',ids)

            $rootScope.ros.getServosInfo(ids).then(data => {

                // console.log(data)
                if (data && data.length > 0) {
                    const servos = data.map((servo) => {
                        return {
                            id: servo.id,
                            angle: parseInt(servo.cur_position / 0x03ff * 200),
                            min_angle: parseInt(servo.min_position / 0x03ff * 200),
                            max_angle: parseInt(servo.max_position / 0x03ff * 200),
                        }
                    })
                    $rootScope.itemIndex = 0
                    if ($rootScope.items.length == 0) {
                        swal.close()
                        $rootScope.items = servos
                        if ($rootScope.items.length > 5) {
                            $rootScope.localMenus[$location.path()] = [
                                {
                                    text: '上一页',
                                    callback: () => {
                                        $rootScope.updatePageInfo($rootScope.pageIndex - 1)
                                        active(0)
                                    }
                                },
                                {
                                    text: '下一页',
                                    callback: () => {
                                        $rootScope.updatePageInfo($rootScope.pageIndex + 1)
                                        active(0)
                                    }
                                },
                            ]
                        }
                        $rootScope.updatePageInfo($rootScope.pageIndex)
                        $scope.servos = $scope.show
                        active(0)
                    } else {
                        $scope.servos = servos
                    }

                    console.log(servos)
                    for (let index = 0; index < 5; index++) {
                        const row = $scope.elements.rows[index];
                        // console.log(row.classList)
                        if (index < servos.length) {
                            $scope.elements.servo_id[index].textContent = servos[index].id
                            $scope.elements.min_angle[index].textContent = servos[index].min_angle
                            $scope.elements.angle[index].textContent = servos[index].angle
                            $scope.elements.max_angle[index].textContent = servos[index].max_angle
                            row.classList.remove('hide')
                        } else {
                            row.classList.add('hide')
                        }
                    }
                    if ($location.path() == '/testing/sservo') {
                        setTimeout(updateData, 100)
                    }

                } else {
                    $rootScope.updatePageInfo()
                    swal.close()
                }

            })
        }
        $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
            console.log(ngRepeatFinishedEvent)
            if ($scope.repeatFinished) {
                return
            }
            $scope.repeatFinished = true
            // window.componentHandler.upgradeAllRegistered()
            $scope.elements = {
                servo_id: document.querySelectorAll('.servo-id'),
                min_angle: document.querySelectorAll('.servo-min-angle'),
                angle: document.querySelectorAll('.servo-angle'),
                max_angle: document.querySelectorAll('.servo-max-angle'),
                rows: document.querySelectorAll('.table-container tr.ng-scope')
            }
            console.log($scope.elements)
            updateData()
        });
        const localHandler = (e) => {
            if ($rootScope.show.length == 0) {
                return
            }
            var i = $scope.activeId
            console.log(i, $rootScope.show)

            switch (e.code) {
                case "ArrowUp":
                    i = i > 0 ? i - 1 : $scope.servos.length - 1
                    break;
                case "ArrowDown":
                    i = i < $scope.servos.length - 1 ? i + 1 : 0
                    break;
                case "ArrowLeft":
                    var position = $scope.servos[i].angle - 10
                    position = position > 0 ? position : 0
                    position = parseInt(position / 200 * 0x03ff)
                    $rootScope.ros.setServoPosition($scope.servos[i].id, position)
                    setTimeout(updateData, 500)

                    break;
                case "ArrowRight":
                    var position = $scope.servos[i].angle + 10
                    position = position < 200 ? position : 200
                    position = parseInt(position / 200 * 0x03ff)
                    $rootScope.ros.setServoPosition($scope.servos[i].id, position)
                    setTimeout(updateData, 500)
                    break;
                default:
                    return false
            }
            if ($scope.activeId != i) {
                active(i)
            }
            return true
        }

        $rootScope.localHandler['/testing/sservo'] = localHandler


    });