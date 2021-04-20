'use strict';

const Scratch = window.Scratch = window.Scratch || {};

const scratchKeyMap = {
  'ArrowLeft': "ArrowUp",
  'ArrowUp': "ArrowRight",
  'ArrowRight': "ArrowDown",
  'ArrowDown': "ArrowLeft",
  'Enter': " ",
  'M': "T"
}

class Runner {
  constructor(canvasId = 'scratch-stage') {
    console.log('create scratch runner')
    const vm = new VirtualMachine();
    Scratch.vm = vm
    Scratch.runner = this
    this.vm = vm
    this.running = false
    // vm.setTurboMode(true);
    // var canvas = document.getElementById(canvasId);
    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', canvasId)
    this.canvas = canvas
    const storage = new ScratchStorage();
    vm.attachStorage(storage);
    vm.on('workspaceUpdate', function () {
      swal.fire("加载完成", {
        // icon: "success",
        showConfirmButton: false,

      });
      setTimeout(function () {
        swal.close()
      }, 500);
      // vm.greenFlag();
      const monitors = vm.runtime.getMonitorState()._list
      for (let i = 0; i < monitors.size; i++) {
        const monitor = monitors.get(i)[1];
        console.log(monitor)
        if (monitor.mode != 'list' && monitor.visible) {
          const element = document.createElement('div')
          element.classList.add('monitor-container')
          element.setAttribute('id', 'monitor-' + i)
          element.setAttribute('value', monitor.value)
          // monitor.params.VARIABLE || monitor.id
          var lable = monitor.params.VARIABLE || monitor.id
          var type = 'addon'
          if (monitor.params.VARIABLE) {
            type = 'builtin'
          }
          if (monitor.mode == 'default' || monitor.mode == 'slider') {
            element.innerHTML = `<span class="monitor-label">${lable}</span> <span class="monitor-value ${type}">${monitor.value}</span>`
          } else if (monitor.mode == 'large') {
            element.innerHTML = `<span class="monitor-large-value ${type}">${monitor.value}</span>`
          }
          element.style.top = monitor.y / 3.0 * 2 + 'px'
          element.style.left = monitor.x / 3.0 * 2 + 'px'
          document.querySelector('#monitor-list').appendChild(element)
        }
        Scratch.monitors = monitors
      }
    })

    vm.on('PROJECT_RUN_START', () => {
      console.log('PROJECT_RUN_START')
      this.running = true
    })
    vm.on('PROJECT_RUN_STOP', () => {
      console.log('PROJECT_RUN_STOP')
      this.running = false
    })

    vm.on('MONITORS_UPDATE', (monitorState) => {
      // console.log('MONITORS_UPDATE', monitorState)
      if (Scratch.monitors && Scratch.monitors.size > 0) {
        const monitors = vm.runtime.getMonitorState()._list
        for (let i = 0; i < monitors.size; i++) {
          const monitorNew = monitors.get(i)[1];
          const monitorOld = Scratch.monitors.get(i)[1]
          if (monitorNew.visible && monitorNew.mode != 'list' && monitorNew.value != monitorOld.value) {
            const element = document.querySelector(`#monitor-${i} .monitor-value`) || document.querySelector(`#monitor-${i} .monitor-large-value`)
            if (element) {
              element.textContent = monitorNew.value
            }
          }
        }
        Scratch.monitors = monitors
      }

    })

    var renderer = new ScratchRender(this.canvas);
    Scratch.renderer = renderer;
    vm.attachRenderer(renderer);
    try {
      var audioEngine = new AudioEngine(audioContext);
      vm.attachAudioEngine(audioEngine);
      document.audioEngine = audioEngine
    } catch (error) {
      console.log(error)
    }
    vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
    vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

    let touchData = {
      start: { clientX: 0, clientY: 0 },
      end: { clientX: 0, clientY: 0 },
    }
    function calculatePageMove() {
      let $rootScope = window.$rootScope
      // swipe left, move next page
      if (touchData.end.clientX - touchData.start.clientX < -40 && $rootScope.pageIndex < $rootScope.maxPageIndex) {
        $rootScope.updatePageInfo($rootScope.pageIndex + 1)

        // swipe right, move prev page
      } else if (touchData.end.clientX - touchData.start.clientX > 40 && $rootScope.pageIndex > 0) {
        $rootScope.updatePageInfo($rootScope.pageIndex - 1)

      }
    }

    function postMouseData(e, keydown = null) {
      if (window.location.hash.split('?')[0] != '#!/scratchRunner') {
        return
      }
      const rect = canvas.getBoundingClientRect();
      console.log(e.clientX, e.clientY, rect.left, rect.top)
      const data = {
        y: e.clientX - rect.left,
        x: 320 - (e.clientY - rect.top),
        canvasHeight: rect.width,
        canvasWidth: rect.height
      };
      if (keydown != null) {
        data.isDown = keydown
      }
      console.log(e, data)
      Scratch.vm.postIOData('mouse', data);
    }

    // Feed mouse events as VM I/O events.
    document.addEventListener('mousemove', e => {
      console.log('mousemove')
      postMouseData(e)
    });
    document.addEventListener('mousedown', e => {
      console.log('mousedown')
      postMouseData(e, true)
      touchData.start = e
    });
    document.addEventListener("touchstart", e => {
      console.log('touchstart', e)
      touchData.start = e.touches[0]
      postMouseData(e.touches[0], true)
    })
    document.addEventListener('mouseup', e => {
      console.log('mouseup')
      postMouseData(e, false)
      touchData.end = e
      if (window.location.hash.split('?')[0] != '#!/scratchRunner') {
        calculatePageMove()
        return
      }
    });
    document.addEventListener("touchend", e => {
      console.log('touchend', e)
      postMouseData(e.changedTouches[0], false)
      touchData.end = e.changedTouches[0]
      if (window.location.hash.split('?')[0] != '#!/scratchRunner') {
        calculatePageMove()
        return
      }
    })
    // Feed keyboard events as VM I/O events.
    document.addEventListener('keydown', e => {
      // Don't capture keys intended for Blockly inputs.
      if (e.target !== document && e.target !== document.body) {
        return;
      }
      if (window.location.hash.split('?')[0] != '#!/scratchRunner') {
        return
      }
      if (e.code == "KeyS") { // S Stop
        this.vm.stopAll()
        this.running = false
      } else if (e.code == "KeyR") { // R Run
        this.vm.greenFlag()
        this.running = true
      }

      console.log(e)
      Scratch.vm.postIOData('keyboard', {
        key: scratchKeyMap[e.key] ? scratchKeyMap[e.key] : e.key,
        isDown: true
      });

    });
    document.addEventListener('keyup', e => {
      if (window.location.hash.split('?')[0] != '#!/scratchRunner') {
        return
      }
      // Always capture up events,
      // even those that have switched to other targets.
      Scratch.vm.postIOData('keyboard', {
        key: scratchKeyMap[e.key] ? scratchKeyMap[e.key] : e.key,
        isDown: false
      });

      // E.g., prevent scroll.
      if (e.target !== document && e.target !== document.body) {
        // e.preventDefault();
      }
    });

    vm.start()
  }
  loadProjectFromFile(path) {
    swal.fire({
      title: "程序加载中",
      showConfirmButton: false,
    });
    var buffer = fs.readFileSync(path);
    console.log(buffer)
    this.vm.loadProject(buffer)

  }
  loadProjectFromUrl(url) {
    swal.fire({
      title: "程序加载中",
      showConfirmButton: false,
    });

    JSZipUtils.getBinaryContent(url, (err, data) => {
      console.log(data)
      this.vm.loadProject(data)
    });
  }
}

const runner = Scratch.runner || new Runner()

angular.module('myApp.scratchRunner', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/scratchRunner', {
      templateUrl: 'pages/explore/scratch-runner/scratch-runner.html',
      controller: 'ScratchRunnerCtrl'
    })
  }])

  .controller('ScratchRunnerCtrl', function ($rootScope, $scope, $location) {
    $rootScope.show_header = false
    $rootScope.show_footer = false
    $scope.monitors = []
    var src = $location.search().src || ''
    $rootScope.items = []
    $rootScope.updatePageInfo()
    console.log(Scratch)
    console.log(runner)
    document.getElementById('scratch').appendChild(runner.canvas)
    runner.loadProjectFromUrl(src)

    $scope.$on('$routeChangeStart', ($event, next, current) => {
      console.log('$routeChangeStart', $event, next, current)
      if (runner.vm.ros._disablePreview) {
        try {
          runner.vm.ros._disablePreview()
        } catch (error) {
          console.log(error)
        }
      }

    });

    $rootScope.localHandler[$location.path()] = (e) => {
      switch (e.code) {
        case "KeyB":
          if (runner.running) {
            runner.vm.stopAll()
            runner.running = false
            return true
          } else {
            console.log('clear scratch-vm data')
            runner.vm.clear()
          }
      }
      return false
    }

  });