'use strict';

const reset_usb = async () => {
  swal({
    title: "正在执行",
    text: "请稍等",
    // icon: "/images/loading.gif",
    button: false,
  })
  let res = await axios.get('/system/usb_reset')
  swal({
    title: "已执行",
    text: "",
    button: false,
    timer: 1000,
  });
}

const calibrate = async () => {
  swal({
    title: "正在执行",
    text: "请稍等",
    // icon: "/images/loading.gif",
    button: false,
  })
  let res = await axios.get('/system/calibrate')
  swal({
    title: "已执行",
    text: "",
    button: false,
    timer: 1000,
  });
}

angular.module('myApp.setting', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/setting', {
      templateUrl: 'pages/templates/item_small.html',
      controller: 'SettingCtrl'
    })
  }])

  .controller('SettingCtrl', function ($scope, $http, $rootScope, $location) {

    const items = [
      {
        id: 0,
        link: '#!/setting/wifi',
        src: `assets/themes/${iconTheme}/icon-wifi.png`,
        name: 'WiFi'
      },
      {
        id: 1,
        link: '#!/setting/bluetooth',
        src: `assets/themes/${iconTheme}/icon-bluetooth.png`,
        name: '蓝牙'
      },
      {
        id: 3,
        link: '#!/setting/audio',
        src: `assets/themes/${iconTheme}/icon-audio.png`,
        name: '音频'
      },
      {
        id: 4,
        link: '#!/setting/rosNode',
        src: `assets/themes/${iconTheme}/icon-node.png`,
        name: '节点管理'
      },
      {
        id: 5,
        link: '#!/setting/deviceInfo',
        src: `assets/themes/${iconTheme}/icon-info.png`,
        name: '设备信息'
      },

    ]
    $rootScope.title = '系统设置'
    let hardware_model = $rootScope.hardware_model
    if (hardware_model && hardware_model.Model && hardware_model.Model.indexOf("Compute Module 4") >= 0) {
      $rootScope.items = items.concat([
        {
          id: 6,
          src: `assets/themes/${iconTheme}/icon-setting.png`,
          name: '按键复位',
          action: "reset_usb"
        },
        {
          id: 7,
          src: `assets/themes/${iconTheme}/icon-setting.png`,
          name: '触控较准',
          action: "calibrate"
        },
      ])
    } else {
      $rootScope.items = items
    }

    $rootScope.rowNum = 3
    $rootScope.colNum = 2
    // $scope.show = items

    $rootScope.localMenus[$location.path()] = [
      {
        text: '扩展系统分区',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal({
            title: '正在设置',
            text: "请稍等",
            button: false,
          });
          $http.get('/system/expand_rootfs').then(res => {
            var data = res.data
            if (data && data.msg) {
              swal({
                title: data.msg,
                text: "",
                button: false,
                timer: 1000,
              });
            }
          })
        }
      }, {
        text: '系统更新',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal({
            title: '正在检查更新',
            text: "请稍等",
            button: false,
          });
          $http.get('/system/update').then(res => {
            var data = res.data
            if (data && data.msg) {
              swal({
                title: data.msg,
                text: "",
                button: false,
                timer: 1000,
              });
            }
          })
        }
      },
      {
        text: '固件更新',
        callback: (index) => {
          console.log(`menu item-${index} clicked`)
          swal({
            title: '正在更新',
            text: "请稍等",
            button: false,
          });
          $http.get('/system/update_firmware').then(res => {
            var data = res.data
            if (data && data.msg) {
              swal({
                title: data.msg,
                text: "",
                button: false,
                timer: 1000,
              });
            }
          })
        }
      },
    ]


    $rootScope.updatePageInfo()
    console.log($rootScope)
  });