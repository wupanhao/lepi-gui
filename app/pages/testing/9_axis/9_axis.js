'use strict';

angular.module('myApp.9_axis', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/testing/9_axis', {
            templateUrl: 'pages/testing/9_axis/9_axis.html',
            controller: '9_axisCtrl'
        });
    }])

    .controller('9_axisCtrl', function ($scope, $rootScope, $location) {
        $rootScope.title = '九轴传感器'
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
        $rootScope.items = items
        $rootScope.rowNum = 1
        $rootScope.colNum = 1

        $rootScope.localMenus[$location.path()] = [
            {
                text: '打开九轴传感器',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    $rootScope.ros.nineAxisSetEnable(0x47)
                    swal.fire({
                        title: '已执行',
                        text: "",
                        button: false,
                        timer: 500,
                    });
                }
            },
            {
                text: '关闭九轴传感器',
                callback: (index) => {
                    console.log(`menu item-${index} clicked`)
                    $rootScope.ros.nineAxisSetEnable(0x00)
                    swal.fire({
                        title: '已执行',
                        text: "",
                        button: false,
                        timer: 500,
                    });
                }
            },
        ]

        $rootScope.updatePageInfo($location.search().page | 0)

        const container = document.getElementById('chart');
        // 初始化echarts对象
        const myChart = echarts.init(container);


        const NUM = 80

        const series = ['x', 'y', 'z'].map(item => {
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
                text: items[$rootScope.pageIndex].title,
                textStyle: {
                    color: '#FFF',
                },
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
                textStyle: {
                    color: '#FFF',
                },
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
                // min: -32767, // 设置y轴刻度的最小值,不设则自适应
                // max: 32767,  // 设置y轴刻度的最大值
                position: 'left',
                scale: true,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                },
                show: true
            }],
            series: series
        };
        const ros_client = $rootScope.ros
        var updateData = () => {
            ros_client.get3AxesData(items[$rootScope.pageIndex].sensorId).then(res => {
                option.title.text = items[$rootScope.pageIndex].title
                option.series[0].data.shift()
                option.series[1].data.shift()
                option.series[2].data.shift()
                option.series[0].data.push(res.data.x)
                option.series[1].data.push(res.data.y)
                option.series[2].data.push(res.data.z)
                // option.series[0].data.push(res.data.x > 32768 ? res.data.x - 65536 : res.data.x)
                // option.series[1].data.push(res.data.y > 32768 ? res.data.y - 65536 : res.data.y)
                // option.series[2].data.push(res.data.z > 32768 ? res.data.z - 65536 : res.data.z)
                // console.log(option.series[0].data)

                myChart.setOption(option);
                if ($location.path() == '/testing/9_axis') {
                    updateData()
                }
            })
        }



        if (ros_client && ros_client.ros && ros_client.ros.isConnected) {
            updateData()
        }

    });

