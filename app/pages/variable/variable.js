'use strict';

angular.module('myApp.variable', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/variable', {
            templateUrl: 'pages/variable/variable.html',
            controller: 'VariableCtrl'
        })
    }])

    .controller('VariableCtrl', function ($rootScope, $http, $location, $scope) {
        $rootScope.show_header = true
        $rootScope.show_footer = true
        $rootScope.title = '变量设置'
        $rootScope.rowNum = 3
        $rootScope.colNum = 2
        console.log('/variable page entered')

        $rootScope.items = []
        $rootScope.updatePageInfo()

        function updateVariableData() {
            $rootScope.ros.variableList().then(res => {
                $scope.data = JSON.parse(res)

                if ($location.path() == '/variable') {
                    $rootScope.items = Object.keys($scope.data).map(name => {
                        return { name: name, value: $scope.data[name] }
                    })
                    $rootScope.updatePageInfo()
                    // swal({
                    //     title: "HTML <small>标题</small>!",
                    //     text: `自定义<span style="color: #F8BB86">html<span>信息。`,
                    //     html: true
                    // });
                } else {
                    console.log('/variable page exit')
                }
            }, (err) => {
                console.log(err)
                $rootScope.updatePageInfo()
            })
        }


        const kb = new SoftKeyboard('#soft-keyboard')

        kb.onComplete = (value) => {
            const item = $rootScope.show[$rootScope.itemIndex]
            console.log(item, value)
        }
        function deleteItem() {
            const item = $rootScope.show[$rootScope.itemIndex]
            if (item && item.name) {
                $http.get(`/variable/delete?name=${encodeURI(item.name)}`).then(res => {
                    if (res.data && res.data.msg) {
                        swal({
                            title: res.data.msg,
                            // text: "",
                            timer: 1000,
                            button: false,
                        });
                        updateVariableData()
                    }
                })
            }
        }

        function setItem(item) {
            if (item.name && item.value != undefined) {
                $http.get(`/variable/set?name=${encodeURI(item.name)}&value=${encodeURI(item.value)}`).then(res => {
                    if (res.data && res.data.msg) {
                        swal({
                            title: res.data.msg,
                            // text: "",
                            timer: 1000,
                            button: false,
                        });
                    }
                    updateVariableData()
                })
            }
        }

        function renameItem(item, name) {
            if (item.name && item.value != undefined && name) {
                $http.get(`/variable/set?name=${encodeURI(name)}&value=${encodeURI(item.value)}`).then(() => {
                    $http.get(`/variable/delete?name=${encodeURI(item.name)}`).then(res => {
                        if (res.data && res.data.code == 0) {
                            swal({
                                title: '重命名成功',
                                // text: "",
                                timer: 1000,
                                button: false,
                            });
                        }
                        updateVariableData()
                    })
                })
            }
        }
        function toggleKBModify() {
            const ele = document.querySelector('#input')
            const v = $rootScope.show[$rootScope.itemIndex]
            const title = document.querySelector('#input .title')
            const value = document.querySelector('#input .input')
            title.textContent = '变量' + v.name + '修改'
            value.value = v.value
            value.placeholder = '数值'
            kb.onComplete = (value) => {
                const item = $rootScope.show[$rootScope.itemIndex]
                ele.classList.add('hide')
                console.log(item, value)
                item.value = value
                setItem(item)
            }
            if (ele && ele.classList.contains('hide')) {
                ele.classList.remove('hide')
            }
        }
        function toggleKBNew() {
            const ele = document.querySelector('#input')
            const v = $rootScope.show[$rootScope.itemIndex]
            const title = document.querySelector('#input .title')
            const value = document.querySelector('#input .input')
            title.textContent = '新增变量'
            value.value = ''
            value.placeholder = '名称'
            kb.onComplete = (value) => {
                ele.classList.add('hide')
                console.log('new', value)
                setItem({ name: value, value: 0 })
            }
            if (ele && ele.classList.contains('hide')) {
                ele.classList.remove('hide')
            }
        }
        function toggleKBRename() {
            const ele = document.querySelector('#input')
            const v = $rootScope.show[$rootScope.itemIndex]
            const title = document.querySelector('#input .title')
            const value = document.querySelector('#input .input')
            title.textContent = '变量' + v.name + '重命名'
            value.value = v.name
            value.placeholder = '新名称'
            kb.onComplete = (value) => {
                ele.classList.add('hide')
                const item = $rootScope.show[$rootScope.itemIndex]
                console.log('rename', item, value)
                renameItem(item, value)
            }
            if (ele && ele.classList.contains('hide')) {
                ele.classList.remove('hide')
            }
        }

        $rootScope.localHandler[$location.path()] = (e) => {
            console.log(e.code)

            const ele = document.querySelector('#input')
            if (ele && !(ele.classList.contains('hide'))) {
                if (kb.keyHandler(e)) {
                    return true
                }
            }
            switch (e.code) {
                case "Enter":
                    toggleKBModify()
                    break;
                case "KeyB":
                    if (ele && !(ele.classList.contains('hide'))) {
                        ele.classList.add('hide')
                    } else {
                        return false
                    }
                    break;
                default:
                    return false
            }
            return true
        }
        $rootScope.localMenus[$location.path()] = [
            {
                text: '修改',
                callback: () => {
                    toggleKBModify()
                }
            },
            {
                text: '重命名',
                callback: () => {
                    toggleKBRename()
                }
            },
            {
                text: '删除',
                callback: deleteItem
            },
            {
                text: '新增',
                callback: () => {
                    toggleKBNew()
                }
            },
        ]
        updateVariableData()
    });