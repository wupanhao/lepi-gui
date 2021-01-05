'use strict';

angular.module('myApp.sensor', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/sensor', {
            templateUrl: 'pages/testing/sensor/sensor.html',
            controller: 'SensorCtrl'
        });
    }])

    .controller('SensorCtrl', function ($scope, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '传感器'
        $rootScope.items = []

        console.log($location.path(), ' entered')
        $scope.sensors = [1, 2, 3, 4, 5].map(port => {
            return {
                value: 0,
                mode: 1,
                id: 0,
                port: port
            }
        })
        $rootScope.updatePageInfo()

        var active = (i) => {
            [0, 1, 2, 3, 4].map((index) => {
                var item = $scope.elements.rows[index]
                if (index == i) {
                    item.classList.add('active')
                    $scope.activeId = i
                } else {
                    item.classList.remove('active')
                }
            })
        }

        $scope.$on('repeatFinished', function (ngRepeatFinishedEvent) {
            console.log(ngRepeatFinishedEvent)
            window.componentHandler.upgradeAllRegistered()
            $scope.elements = {
                id: document.querySelectorAll('.sensor-id'),
                mode: document.querySelectorAll('.sensor-mode'),
                value: document.querySelectorAll('.sensor-value'),
                rows: document.querySelectorAll('.table-container tr.ng-scope')
            }
            console.log($scope.elements)
            active(0)
        });

        var updateData = () => {
            $rootScope.ros.getSensorsInfo().then(data => {
                // console.log(data)
                if (data && data.length == 5) {
                    data.map((sensor, index) => {
                        sensor.id = sensor.enable
                        sensor.mode = sensor.speed
                        sensor.value = sensor.position
                        if ($scope.sensors[index].id != sensor.id) {
                            $scope.elements.id[index].textContent = $rootScope.sensorName[sensor.id]
                            $scope.sensors[index].id = sensor.id
                        }
                        if ($scope.sensors[index].value != sensor.value) {
                            $scope.elements.value[index].textContent = sensor.value
                            $scope.sensors[index].value = sensor.value
                        }
                    })
                }

                if ($location.path() == '/testing/sensor') {
                    setTimeout(updateData, 100)
                }
            })
        }

        const localHandler = (e) => {
            var i = $scope.activeId
            switch (e.code) {
                case "ArrowUp":
                    i = i > 0 ? i - 1 : 4
                    break;
                case "ArrowDown":
                    i = i < 4 ? i + 1 : 0
                    break;
                default:
                    return false
            }
            if ($scope.activeId != i) {
                active(i)
            }
            return true
        }

        $rootScope.localHandler['/testing/sensor'] = localHandler

        updateData()

    });
