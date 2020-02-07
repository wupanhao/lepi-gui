'use strict';

const Scratch = window.Scratch = window.Scratch || {};

class Runner {
  constructor(canvasId = 'scratch-stage') {
    const vm = new VirtualMachine();
    Scratch.vm = vm
    Scratch.runner = this
    this.vm = vm
    this.running = false
    vm.setTurboMode(true);
    var canvas = document.getElementById(canvasId);
    const storage = new ScratchStorage();
    vm.attachStorage(storage);
    vm.on('workspaceUpdate', function () {
      swal("加载完成", {
        // icon: "success",
        button: false,
      });
      setTimeout(function () {
        swal.close()
      }, 500);
      // vm.greenFlag();
    })

    vm.on('PROJECT_RUN_START', () => {
      console.log('PROJECT_RUN_START')
      this.running = true
    })
    vm.on('PROJECT_RUN_STOP', () => {
      console.log('PROJECT_RUN_STOP')
      this.running = false
    })

    var renderer = new ScratchRender(canvas);
    Scratch.renderer = renderer;
    vm.attachRenderer(renderer);
    var audioEngine = new AudioEngine();
    vm.attachAudioEngine(audioEngine);
    vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
    vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

    // Feed mouse events as VM I/O events.
    document.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const coordinates = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        canvasWidth: rect.width,
        canvasHeight: rect.height
      };
      Scratch.vm.postIOData('mouse', coordinates);
    });
    canvas.addEventListener('mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      const data = {
        isDown: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        canvasWidth: rect.width,
        canvasHeight: rect.height
      };
      Scratch.vm.postIOData('mouse', data);
      e.preventDefault();
    });
    canvas.addEventListener('mouseup', e => {
      const rect = canvas.getBoundingClientRect();
      const data = {
        isDown: false,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        canvasWidth: rect.width,
        canvasHeight: rect.height
      };
      Scratch.vm.postIOData('mouse', data);
      e.preventDefault();
    });

    // Feed keyboard events as VM I/O events.
    document.addEventListener('keydown', e => {
      // Don't capture keys intended for Blockly inputs.
      if (e.target !== document && e.target !== document.body) {
        return;
      }
      console.log(e)
      if (e.keyCode == KEY.S) { // S Stop
        this.vm.stopAll()
        this.running = false
      } else if (e.keyCode == KEY.R) { // R Run
        this.vm.greenFlag()
        this.running = true
      }

      Scratch.vm.postIOData('keyboard', {
        key: e.key,
        isDown: true
      });

    });
    document.addEventListener('keyup', e => {
      // Always capture up events,
      // even those that have switched to other targets.
      Scratch.vm.postIOData('keyboard', {
        key: e.key,
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
    swal("程序加载中", {
      button: false,
    });
    var buffer = fs.readFileSync(path);
    console.log(buffer)
    this.vm.loadProject(buffer)

  }
  loadProjectFromUrl(url) {
    swal("程序加载中", {
      button: false,
    });
    JSZipUtils.getBinaryContent(url, (err, data) => {
      console.log(data)
      this.vm.loadProject(data)
    });
  }
}

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

    var src = $location.search().src || ''
    $rootScope.items = []
    $rootScope.updatePageInfo()

    const runner = Scratch.runner || new Runner()
    runner.loadProjectFromUrl(src)

    $scope.$on('keyEvent' + $location.path(), (name, e) => {
      console.log(e)
      switch (e.keyCode) {
        case KEY.ArrowLeft:
        case KEY.ArrowRight:
        case KEY.ArrowUp:
        case KEY.ArrowDown:
        case KEY.Enter:
        case KEY.M:
        case KEY.B:
        case KEY.R:
        case KEY.S:
          break;
        default:
          // console.log(e.keyCode, 'ignore keyup event', e)
          break;
      }
    })

  });