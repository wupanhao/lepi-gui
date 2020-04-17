'use strict';

angular.module('myApp.servo', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/servo', {
            templateUrl: 'pages/testing/servo/servo.html',
            controller: 'ServoCtrl'
        });
    }])

    .controller('ServoCtrl', function ($scope, $location, $rootScope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '舵机'
        $rootScope.items = []
        console.log($location.path(), ' entered')
        $scope.motors = [1, 2, 3, 4, 5].map(port => {
            return {
                position: 0,
                enable: 0,
                speed: 0,
                angle:0,
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
                        motor.angle = parseInt((motor.speed -4500 )/32)
                        if(motor.angle < -90)
                            motor.angle = -90
                        if(motor.angle > 90)
                            motor.angle = 90
                        $scope.motors[id].angle = motor.angle
                        
                        if ($scope.motors[id].speed != motor.speed) {
                            $scope.elements.speed[id].textContent = motor.angle
                            $scope.motors[id].speed = motor.speed
                        }
                        // if ($scope.motors[id].position != motor.position) {
                        //     $scope.elements.position[id].textContent = motor.position
                        //     $scope.motors[id].position = motor.position
                        // }
                        if ($scope.motors[id].enable != motor.enable) {
                            if (motor.enable == 1) {
                                $scope.elements.toggle[id].MaterialSwitch.on()
                            } else {
                                $scope.elements.toggle[id].MaterialSwitch.off()
                            }
                            $scope.motors[id].enable = motor.enable
                        }
                    })
                }

                if ($location.path() == '/testing/servo') {
                    setTimeout(updateData, 200)
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
                    var speed = $scope.motors[i].angle - 10
                    speed = speed > -90 ? speed : -90
                    speed = Math.round(4500 + speed*32)
                    $rootScope.ros.motorSetSpeed(i + 1, speed)
                    break;
                case "ArrowRight":
                    var speed = $scope.motors[i].angle + 10
                    speed = speed > 90 ? 90 : speed
                    speed = Math.round(4500 + speed*32)
                    $rootScope.ros.motorSetSpeed(i + 1, speed)
                    break;
                case "Enter":
                    $rootScope.ros.motorSetType(i + 1, 1 - $scope.motors[i].enable)
                    break;
            }
            if ($scope.activeId != i) {
                active(i)
            }
        }

        $rootScope.localHandler['/testing/servo'] = localHandler

        updateData()

    });