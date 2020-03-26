// const VirtualMachine = require('scratch-vm')
// const ScratchStorage = require('scratch-storage')
// const ScratchRender = require('scratch-render')
// const AudioEngine = require('scratch-audio')
// const ScratchSVGRenderer = require('scratch-svg-renderer')
// const axios = require("axios");
// const JSZipUtils = require("jszip-utils")

const Scratch = window.Scratch = window.Scratch || {};

class Runner {
  constructor() {
    const vm = new VirtualMachine();
    Scratch.vm = vm
    this.vm = vm
    this.running = false
    vm.setTurboMode(true);
    var canvas = document.getElementById('scratch-stage');
    const storage = new ScratchStorage();
    // var AssetType = storage.AssetType;
    // storage.addWebSource([AssetType.Project], getProjectUrl);
    // storage.addWebSource([AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound], getAssetUrl);
    vm.attachStorage(storage);
    // const audioContext = new window.AudioContext()
    // audioContext.resume().then(() => {
    //   console.log('audioContext resumed')
    // })
    vm.on('workspaceUpdate', function () {
      swal("加载完成", {
        // icon: "success",
        button: false,
      });
      setTimeout(function () {
        // swal.close()
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
    try {
      var audioEngine = new AudioEngine();
      vm.attachAudioEngine(audioEngine);
    } catch (error) {
      console.log(error)
    }

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
      if (e.keyCode == 69) { // S Stop
        this.vm.stopAll()
        this.running = false
      } else if (e.keyCode == 82) { // R Run
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

navigator.getUserMedia({ audio: true }, function (stream) {
  const runner = new Runner()
  runner.loadProjectFromUrl('http://localhost:8000/explore/Desktop/乐派/hello.sb3')
  // console.log(getUrlParam('path'))
}, function (err) {
  console.log(err)
  const runner = new Runner()
  runner.loadProjectFromUrl('http://localhost:8000/explore/Desktop/乐派/hello.sb3')
})