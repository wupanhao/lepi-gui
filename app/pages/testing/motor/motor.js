'use strict';

angular.module('myApp.motor', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/motor', {
            templateUrl: 'pages/testing/motor/motor.html',
            controller: 'MotorCtrl'
        });
    }])

    .controller('MotorCtrl', function ($scope, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '电机'
        $rootScope.items = []
        console.log($location.path(), ' entered')
        $scope.motors = [1, 2, 3, 4, 5].map(port => {
            return {
                position: 0,
                enable: 1,
                speed: 0,
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
                toggle: document.querySelectorAll('.mdl-switch'),
                speed: document.querySelectorAll('.motor-speed'),
                position: document.querySelectorAll('.motor-position'),
                rows: document.querySelectorAll('.table-container tr.ng-scope')
            }
            console.log($scope.elements)
            active(0)
        });

        var updateData = () => {
            $rootScope.ros.getMotorsInfo().then(data => {
                // console.log(data)
                if (data && data.length == 5) {
                    data.map((motor, id) => {
                        motor.speed = Math.round(motor.speed / 10.0 / 655.35) * 10
                        if ($scope.motors[id].speed != motor.speed) {
                            $scope.elements.speed[id].textContent = motor.speed
                            $scope.motors[id].speed = motor.speed
                        }
                        if ($scope.motors[id].position != motor.position) {
                            $scope.elements.position[id].textContent = motor.position
                            $scope.motors[id].position = motor.position
                        }
                        if ($scope.motors[id].enable != motor.enable) {
                            if (motor.enable == 0) {  // type
                                $scope.elements.toggle[id].MaterialSwitch.on()
                                $rootScope.ros.motorSetSpeed(id + 1, motor.speed)
                            } else {
                                $scope.elements.toggle[id].MaterialSwitch.off()
                                $rootScope.ros.motorSetState(id + 1, 0)
                            }
                            $scope.motors[id].enable = motor.enable
                        }
                    })
                }

                if ($location.path() == '/testing/motor') {
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
                case "ArrowLeft":
                    var speed = $scope.motors[i].speed - 10
                    speed = Math.round(speed / 10.0) * 10
                    speed = speed > -100 ? speed : -100
                    speed = Math.round(speed * 655.35)
                    $rootScope.ros.motorSetPulse(i + 1, speed)
                    break;
                case "ArrowRight":
                    var speed = $scope.motors[i].speed + 10
                    speed = Math.round(speed / 10.0) * 10
                    speed = speed > 100 ? 100 : speed
                    speed = Math.round(speed * 655.35)
                    $rootScope.ros.motorSetPulse(i + 1, speed)
                    break;
                case "Enter":
                    $rootScope.ros.motorSetType(i + 1, 1 - $scope.motors[i].enable).then(console.log)
                    break;
                default:
                    return false
            }
            if ($scope.activeId != i) {
                active(i)
            }
            return true
        }

        $rootScope.localHandler['/testing/motor'] = localHandler

        updateData()

    });