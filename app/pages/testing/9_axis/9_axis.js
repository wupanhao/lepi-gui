'use strict';

angular.module('myApp.9_axis', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/9_axis', {
            templateUrl: 'pages/testing/9_axis/9_axis.html',
            controller: '9_axisCtrl'
        });
    }])

    .controller('9_axisCtrl', function ($scope, $rootScope, $location) {
        const items = [{
            title: '加速度',
            sensorId: 1
        }, {
            title: '陀螺仪',
            sensorId: 2
        }, {
            title: '磁力计',
            sensorId: 3
        },
        ]
        $scope.items = items
        const pageIndex = $location.search().page | 0
        $scope.pageInfo = {
            itemIndex: 0,
            pageIndex: pageIndex,
            pageNum: items.length
        }

        $scope.click = (id) => {
            console.log(id)
            $scope.pageInfo.itemIndex = id
            console.log($scope.pageInfo)
        }
        $scope.$on('keyEvent/9_axis', (name, e) => {
            console.log('9_axis', e)
            switch (e.keyCode) {
                case KEY.ArrowLeft:
                    if ($scope.pageInfo.itemIndex > 0) {
                        $scope.pageInfo.itemIndex--
                    }
                    break;
                case KEY.ArrowRight:
                    if ($scope.pageInfo.itemIndex < $scope.pageInfo.pageNum - 1) {
                        $scope.pageInfo.itemIndex++
                    }
                    break;
                case KEY.ArrowUp:
                    break;
                case KEY.ArrowDown:
                    break;
                case KEY.Enter:
                    break;
                case KEY.M:
                    break;
                case KEY.B:
                    break;
                case KEY.R:
                    break;
                case KEY.S:
                    break;
            }
            var i = $scope.pageInfo.itemIndex
            // document.getElementsByClassName('card')[i].click(i)
            console.log($scope.pageInfo)
        })

        const container = document.getElementById('chart');
        // 初始化echarts对象
        const myChart = echarts.init(container);

        var ros = new ros_client('ws://192.168.50.234:9090')

        const NUM = 80

        const series = ['x','y','z'].map( item => {
            return {
                name: item,
                type: 'line',
                symbol: 'none',
                data: new Array(NUM).fill(0)
            }
        })

        // myChart.hideLoading();

        const option = {
            title: {
                text: items[pageIndex].title,
                left: 'center'

            },
            // backgroundColor: '#FBFBFB',                  // -----------> // 给echarts图设置背景色   
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['x', 'y', 'z'],
                orient: 'vertical',
                left: 'right',
                // aline: 'right'
            },
            grid: {
                left: 'left',
                right: '0',
                bottom: '0'
            },

            // calculable: true,

            xAxis: [{
                type: 'category',
                // boundaryGap: false,
                data: new Array(NUM).fill(' '),
                show: false
            }],
            yAxis: [{
                type: 'value',
                min: -32767, // 设置y轴刻度的最小值
                max: 32767,  // 设置y轴刻度的最大值
                position: 'left',
                show: false
            }],
            series: series
        };

        var updateData = () => {
            ros.get3AxesData(items[$scope.pageInfo.itemIndex].sensorId).then(res => {
                option.title.text = items[$scope.pageInfo.itemIndex].title
                option.series[0].data.shift()
                option.series[1].data.shift()
                option.series[2].data.shift()
                // option.series[0].data.push(res.data.x)
                // option.series[1].data.push(res.data.y)
                // option.series[2].data.push(res.data.z)                   
                option.series[0].data.push(res.data.x > 32768 ? res.data.x - 65536 : res.data.x)
                option.series[1].data.push(res.data.y > 32768 ? res.data.y - 65536 : res.data.y)
                option.series[2].data.push(res.data.z > 32768 ? res.data.z - 65536 : res.data.z)
                // console.log(option.series[0].data)
                updateData()
                myChart.setOption(option);
            })
        }

        ros.conectToRos(() => {
            updateData()
        })

    });

