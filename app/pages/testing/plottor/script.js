// let the editor know that `Chart` is defined by some code
// included in another file (in this case, `index.html`)
// Note: the code will still work without this line, but without it you
// will see an error in the editor
/* global Chart */
/* global Graph */
/* global TransformStream */
/* global TextEncoderStream */
/* global TextDecoderStream */
'use strict';

var Graph = function (canvas) {
  let adaChart;
  let plotType;

  this.chart = canvas.getContext('2d');
  this.maxBufferSize = 100;

  this.XTConfig = {
    type: 'line', // make it a line chart
    data: {
      labels: [],
      datasets: []
    },
    options: {
      elements: {
        line: {
          tension: 0,
          fill: false
        },
      },
      animation: {
        duration: 0
      },
      hover: {
        enabled: false
      },
      tooltips: {
        enabled: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
          bounds: 'data',
          distribution: 'series',
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            display: false,
          },
        }],
        yAxes: [{
          ticks: {
            maxRotation: 0
          }
        }]
      },
      maintainAspectRatio: false,
    }
  };

  this.XYConfig = {
    type: 'scatter', // make it a scatter chart
    data: {
      labels: [],
      datasets: []
    },
    options: {
      elements: {
        line: {
          tension: 0,
          fill: false
        },
      },
      animation: {
        duration: 0
      },
      hover: {
        enabled: false
      },
      tooltips: {
        enabled: false
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'linear',
          bounds: 'data',
          distribution: 'series',
          ticks: {
            display: true,
          },
        }],
        yAxes: [{
          ticks: {
            maxRotation: 0
          }
        }]
      },
    }
  };
}

Graph.prototype = {
  create: function (plotType) {
    if (this.plotType == undefined) {
      if (plotType != undefined) {
        this.setPlotType(plotType);
      } else {
        this.plotType = "xt";
      }
    } else if (plotType != undefined) {
      this.setPlotType(plotType);
    }

    // Remove any existing chart
    if (this.adaChart != undefined) {
      this.adaChart.destroy();
      delete this.adaChart;
    }
    let config = this.getConfig();
    // this.adaChart = new Chart(this.chart, config);
    this.adaChart = new Chart(this.chart, config);
    console.log(this.adaChart)
    this.resize();
  },
  getConfig: function () {
    if (this.plotType == 'xy') {
      return this.XYConfig;
    } else {
      return this.XTConfig;
    }
  },
  setPlotType: function (type) {
    if (type.toLowerCase() == "xy") {
      this.plotType = "xy";
    } else {
      this.plotType = "xt";
    }
  },
  updateLabelColor: function (color) {
    // V2.x API
    // this.adaChart.options.scales.xAxes[0].ticks.fontColor = color;
    // this.adaChart.options.scales.yAxes[0].ticks.fontColor = color;
    this.adaChart.options.scales.xAxes.ticks.color = color;
    this.adaChart.options.scales.yAxes.ticks.color = color;
    this.adaChart.update();
  },
  reset: function () {
    // Clear the data
    let dataSetLength = this.adaChart.data.datasets.length;
    for (let i = 0; i < dataSetLength; i++) {
      this.adaChart.data.datasets.pop();
    }
    this.adaChart.data.labels = [];
    this.adaChart.update();
  },
  addDataSet: function (label, color) {
    let dataConfig;
    if (this.plotType == 'xy') {
      dataConfig = {
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color,
        borderWidth: 1,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 5,
        pointHoverRadius: 5,
        fill: false,
        tension: 0,
        showLine: false
      }
    } else {
      dataConfig = {
        label: label,
        data: [],
        borderColor: color,
        backgroundColor: color,
        borderWidth: 1,
        pointRadius: 0
      }
    }
    this.adaChart.data.datasets.push(dataConfig);
  },
  update: function () {
    this.adaChart.update();
  },
  resize: function () {
    if (this.plotType == 'xy') {
      this.chart.canvas.parentNode.style.width = '100%';
    } else {
      this.chart.canvas.parentNode.style.width = '100%';
    }
  },
  addValue: function (dataSetIndex, value) {
    if (this.plotType == 'xy' && Array.isArray(value)) {
      this.adaChart.data.datasets[dataSetIndex].data.push({
        x: value[0],
        y: value[1]
      });
    } else if (this.plotType == 'xt') {
      let time = new Date();
      this.adaChart.data.datasets[dataSetIndex].data.push({
        t: time,
        y: value
      });
    }
    // this.flushBuffer();
  },
  flushBuffer: function () {
    // Make sure to shift out old data
    this.adaChart.data.datasets.forEach(
      dataset => {
        if (dataset.data.length > this.maxBufferSize) {
          dataset.data.shift()
        }
      }
    )
    if (this.adaChart.data.labels.length > this.maxBufferSize) {
      this.adaChart.data.labels.shift()
    }


    this.update();
  },
  dataset: function (dataSetIndex) {
    return this.adaChart.data.datasets[dataSetIndex];
  },
  setBufferSize: function (size) {
    this.maxBufferSize = size;
  }
}


let connected;
let reader;
let inputDone;
let outputDone;
let inputStream;
let outputStream;
let addValue;
let showLog = false;

const colors = ['#FF0000', '#009900', '#0000FF', '#FF9900', '#CC00CC', '#666666', '#00CCFF', '#000000'];
let dataSets = [];

// const baudRates = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880, 115200, 230400, 250000, 500000, 1000000, 2000000];
const bufferSizes = [250, 500, 1000, 2500, 5000];
const log = document.getElementById('log');
const butConnect = document.getElementById('butConnect');
const butClear = document.getElementById('butClear');
const serCommand = document.getElementById('serCommand');
const butSend = document.getElementById('butSend');
const baudRate = document.getElementById('baudRate');
const autoscroll = document.getElementById('autoscroll');
const showTimestamp = document.getElementById('showTimestamp');
const plotType = document.getElementById('plotType');
const bufferSize = document.getElementById('bufferSize');
const lightSS = document.getElementById('light');
const darkSS = document.getElementById('dark');
const darkMode = document.getElementById('darkmode');
let graph;


/* V2.x
let addJSONValue = function (value) {

  for (let index = 0; index < dataSets.length; index++) {
    const dataSet = dataSets[index];
    let dataItem = value[dataSet.field];
    try {
      graph.addValue(index, dataItem);
      // graph.adaChart.addData([dataItem], dataSet.field)
    } catch (error) {
      console.log(error)
    }

  }

  // dataSets.forEach((dataSet, index) => {
  //   let dataItem = value[dataSet.field];
  //   graph.addValue(index, dataItem);
  // });
  graph.flushBuffer()
}
*/
// V3.0
let addJSONValue = (value) => {
  graph.adaChart.data.labels.push('');
  graph.adaChart.data.datasets.forEach((dataset, index) => {
    let data = value[dataSets[index].field]
    // console.log(value, dataSets[index].field, data)
    dataset.data.push(data);
  });
  // chart.update();
  graph.flushBuffer()
}

let addCSVValue = function (value) {
  if (graph.plotType == 'xy') {
    graph.addValue(0, value.csvdata);
  } else {
    dataSets.forEach((dataSet, index) => {
      graph.addValue(index, value.csvdata[dataSet.field]);
    });
  }
}

addValue = addJSONValue


/*
document.addEventListener('DOMContentLoaded', () => {
  // butConnect.addEventListener('click', clickConnect);
  // butSend.addEventListener('click', clickSend);
  // butClear.addEventListener('click', clickClear);
  // plotType.addEventListener('change', changePlotType);
  // autoscroll.addEventListener('click', clickAutoscroll);
  // showTimestamp.addEventListener('click', clickTimestamp);
  // baudRate.addEventListener('change', changeBaudRate);
  // bufferSize.addEventListener('change', changeBufferSize);
  // darkMode.addEventListener('click', clickDarkMode);

  // initBaudRate();

  // initBufferSize();
  graph = new Graph(document.getElementById('myChart'));
  loadAllSettings();
  createChart();
  graph.adaChart.options.title = {
    display: true,
    padding: 5,
    text: 'Custom Chart Title'
  }
  // connect()

});
*/

angular.module('myApp.plottor', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/testing/plottor', {
      templateUrl: 'pages/testing/plottor/index.html',
      controller: 'PlottorCtrl'
    });
  }])

  .controller('PlottorCtrl', function ($scope, $location, $rootScope) {
    $rootScope.show_header = false
    $rootScope.show_footer = false
    $rootScope.title = '绘图器'
    $rootScope.items = []
    console.log($location.path(), ' entered')

    graph = new Graph(document.getElementById('myChart'));
    loadAllSettings();
    createChart();
    graph.adaChart.options.title = {
      display: true,
      padding: 5,
      text: ''
    }

    let content = document.querySelector('#content')
    content.classList.add('fullscreen')

    $scope.selected = ''

    let updateFreq = [1000 * 30, 1000 * 5, 1000 / 2.0, 1000 / 15.0, 1000 / 30.0]
    let updateMode = 3
    let timer = null

    function tryClearInterval() {
      if (timer) {
        try {
          clearInterval(timer)
          timer = null
        } catch (error) {
          console.log(error)
        }
      }
      reset()
    }

    function startReadLoop(callback) {
      tryClearInterval()
      if (callback) {
        timer = setInterval(() => {
          if ($location.path() == '/testing/plottor' && timer) {
            callback()
          } else {
            tryClearInterval()
            return
          }
        }, updateFreq[updateMode])
      }
    }

    async function startSensorReadLoop(port) {
      $scope.selected = port
      let type = await $rootScope.ros.getSensorType(port)
      let mode = await $rootScope.ros.getSensorMode(port)
      graph.adaChart.options.title.text = $rootScope.sensorName[type]
      if (mode > 0) {
        graph.adaChart.options.title.text += `-模式${mode}`
      }
      if (type > 0) {
        startReadLoop(() => {
          $rootScope.ros.getSensorValue(port).then(value => {
            if ($scope.selected == port) {
              if (type == 29 && mode == 3) {
                let R = value & 0xFF
                let G = value >> 8 & 0xFF
                let B = value >> 16 & 0xFF
                let A = value >> 24 & 0xFF
                setupOrUpdate({ R, G, B, A })
              } else if (type == 35) {
                let active = (value >> 31) & 0x01
                let env = ((value >> 16) & 0x7fff) / 100.0
                let meas = (value & 0xffff) / 100.0
                setupOrUpdate({ active, env, meas })
              } else {
                setupOrUpdate({ value })
              }
            }
          })
        })
      } else {
        startReadLoop()
      }
    }

    function changePlotType(type) {
      if (graph.plotType != type) {
        graph.setPlotType(type);
        reset();
        createChart();
      }
    }

    function switchDataSource(item) {

      changePlotType('xt');

      switch (item) {
        case '加速度':
          graph.adaChart.options.title.text = '加速度'
          $scope.selected = '加速度'
          startReadLoop(() => {
            $rootScope.ros.get3AxesData(1).then(res => {
              if ($scope.selected == '加速度') {
                setupOrUpdate(res.data)
              }
            })
          })
          break
        case '角速度':
          graph.adaChart.options.title.text = '角速度'
          $scope.selected = '角速度'
          startReadLoop(() => {
            $rootScope.ros.get3AxesData(2).then(res => {
              if ($scope.selected == '角速度') {
                setupOrUpdate(res.data)
              }
            })
          })
          break
        case '磁力计':
          graph.adaChart.options.title.text = '磁力计'
          $scope.selected = '磁力计'
          startReadLoop(() => {
            $rootScope.ros.get3AxesData(3).then(res => {
              if ($scope.selected == '磁力计') {
                setupOrUpdate(res.data)
              }
            })
          })
          break
        case '磁力计XY':
          graph.adaChart.options.title.text = '磁力计XY'
          $scope.selected = '磁力计XY'
          changePlotType('xy');
          startReadLoop(() => {
            $rootScope.ros.get3AxesData(3).then(res => {
              if ($scope.selected == '磁力计XY') {
                setupOrUpdate({ '地磁XY': [res.data.x, res.data.y] })
              }
            })
          })
          break
        case '电压电流':
          graph.adaChart.options.title.text = '电压电流'
          $scope.selected = '电压电流'
          changePlotType('xt');
          startReadLoop(() => {
            $rootScope.ros.getPowerMeas().then(res => {
              if ($scope.selected == '电压电流') {
                setupOrUpdate({ 'mV': res.data.y, 'mA': res.data.x })
              }
            })
          })
          break
        case 'Vout1':
          graph.adaChart.options.title.text = 'Vout1'
          $scope.selected = 'Vout1'
          changePlotType('xt');
          startReadLoop(() => {
            $rootScope.ros.getVout1().then(res => {
              if ($scope.selected == 'Vout1') {
                setupOrUpdate({ 'mV': res.data.y, 'mA': res.data.x })
              }
            })
          })
          break
        case 'Vout2':
          graph.adaChart.options.title.text = 'Vout2'
          $scope.selected = 'Vout2'
          changePlotType('xt');
          startReadLoop(() => {
            $rootScope.ros.getVout2().then(res => {
              if ($scope.selected == 'Vout2') {
                setupOrUpdate({ 'mV': res.data.y, 'mA': res.data.x })
              }
            })
          })
          break

        case '传感器S1':
          startSensorReadLoop(1)
          break
        case '传感器S2':
          startSensorReadLoop(2)
          break
        case '传感器S3':
          startSensorReadLoop(3)
          break
        case '传感器S4':
          startSensorReadLoop(4)
          break
        case '传感器S5':
          startSensorReadLoop(5)
          break
        default:
          graph.adaChart.options.title.text = '接收数据'
          startReadLoop()
      }
    }

    $rootScope.localMenus[$location.path()] = [
      // {
      //   text: '接收数据',
      //   callback: (index) => {

      //   }
      // },
      {
        text: '加速度',
        callback: (index) => {
          switchDataSource('加速度')
        }
      },
      {
        text: '角速度',
        callback: (index) => {
          switchDataSource('角速度')

        }
      },
      {
        text: '磁力计',
        callback: (index) => {
          switchDataSource('磁力计')
        }
      },
      {
        text: '磁力计XY',
        callback: (index) => {
          switchDataSource('磁力计XY')
        }
      },
      {
        text: '传感器S1',
        callback: (index) => {
          switchDataSource('传感器S1')
        }
      }, {
        text: '传感器S2',
        callback: (index) => {
          switchDataSource('传感器S2')
        }
      }, {
        text: '传感器S3',
        callback: (index) => {
          switchDataSource('传感器S3')
        }
      }, {
        text: '传感器S4',
        callback: (index) => {
          switchDataSource('传感器S4')
        }
      }, {
        text: '传感器S5',
        callback: (index) => {
          switchDataSource('传感器S5')
        }
      }, {
        text: '电压电流',
        callback: (index) => {
          switchDataSource('电压电流')
        }
      }, {
        text: 'Vout1',
        callback: (index) => {
          switchDataSource('Vout1')
        }
      }, {
        text: 'Vout2',
        callback: (index) => {
          switchDataSource('Vout2')
        }
      },

    ]

    const localHandler = (e) => {
      var i = $scope.activeId
      switch (e.code) {
        case "ArrowLeft":
          if (updateMode > 0) {
            updateMode--
          }

          break;
        case "ArrowRight":
          if (updateMode < updateFreq.length - 1) {
            updateMode++
          }
          break;
        default:
          return false
      }
      swal.fire({
        title: `数据更新间隔:${parseInt(updateFreq[updateMode])}ms`,
        timer: 1500,
      })
      if ($scope.selected > 0) {
        switchDataSource(`传感器S${$scope.selected}`)
      } else {
        switchDataSource($scope.selected)
      }
      console.log($scope.selected)
      return true
    }

    $rootScope.localHandler[$location.path()] = localHandler

    $rootScope.updatePageInfo()

    reset()
    // connect()

  })

// Update the label color only after CSS is finished
// log.addEventListener('transitionend', function () {
//   graph.updateLabelColor(window.getComputedStyle(log).color);
// }, false);

function setupOrUpdate(value) {
  // Initialize the chart if we haven't already
  if (graph.adaChart.data.datasets.length < 1) {
    setupChart(value);
  }
  addValue(value);
  if (showLog) {
    logData(JSON.stringify(value))
  }
  // controller.enqueue(new TextEncoder("utf-8").encode(JSON.stringify(value) + '\n'));
}

/**
 * @name connect
 * Opens a Web Serial connection to a micro:bit and sets up the input and
 * output stream.
 */
async function connect() {
  let count = 0
  console.log('start', new Date())
  let timer = setInterval(() => {
    try {
      count++
      if (count > 500 || connected == false) {
        console.log('stop', new Date())
        clearInterval(timer)
      } else {
        let value = { x: Math.random() * 5, y: Math.random() * 15, z: Math.random() * 35 }
        setupOrUpdate(value)
      }
    } catch (error) {
      console.log(error)
    }

  }, 30)
  return

  readLoop().catch((error) => {
    toggleUIConnected(false);
  });
}

function logData(line) {
  // Update the Log
  if (showTimestamp.checked) {
    let d = new Date();
    let timestamp = d.getHours() + ":" + `${d.getMinutes()}`.padStart(2, 0) + ":" +
      `${d.getSeconds()}`.padStart(2, 0) + "." + `${d.getMilliseconds()}`.padStart(3, 0);
    log.innerHTML += '<span class="timestamp">' + timestamp + ' -> </span>';
    d = null;
  }
  log.innerHTML += line + "<br>\n";

  // Remove old log content
  if (log.textContent.split("\n").length > 100 + 10) {
    let logLines = log.innerHTML.replace(/(\n)/gm, "").split("<br>");
    log.innerHTML = logLines.splice(-100).join("<br>\n");
    console.log(logLines.length)
  }

  if (autoscroll.checked) {
    log.scrollTop = log.scrollHeight
  }
}


/**
 * @name updateTheme
 * Sets the theme to  Adafruit (dark) mode. Can be refactored later for more themes
 */
function updateTheme() {
  // Disable all themes
  document
    .querySelectorAll('link[rel=stylesheet].alternate')
    .forEach((styleSheet) => {
      enableStyleSheet(styleSheet, false);
    });

  if (darkMode && darkMode.checked) {
    enableStyleSheet(darkSS, true);
  } else {
    enableStyleSheet(lightSS, true);
  }

  // graph.updateLabelColor(window.getComputedStyle(log).color);
}

function enableStyleSheet(node, enabled) {
  node.disabled = !enabled;
}


/**
 * @name reset
 * Reset the Plotter, Log, and associated data
 */
async function reset() {
  // Clear the data
  dataSets = [];
  graph.reset();
  // log.innerHTML = "";
}

/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
  if (connected) {
    connected = false
    reset();
  } else {
    connect();
    connected = true
  }
  toggleUIConnected(connected);

}

/**
 * @name clickSend
 * Click handler for the send button.
 */
async function clickSend() {
  let command = serCommand.value;
  serCommand.value = '';
  writeToStream(command);
}

/**
 * @name clickAutoscroll
 * Change handler for the Autoscroll checkbox.
 */
async function clickAutoscroll() {
  saveSetting('autoscroll', autoscroll.checked);
}

/**
 * @name clickTimestamp
 * Change handler for the Show Timestamp checkbox.
 */
async function clickTimestamp() {
  saveSetting('timestamp', showTimestamp.checked);
}

/**
 * @name changeBaudRate
 * Change handler for the Baud Rate selector.
 */
async function changeBaudRate() {
  saveSetting('baudrate', baudRate.value);
}

/**
 * @name changeBufferSize
 * Change handler for the Buffer Size selector.
 */
async function changeBufferSize() {
  saveSetting('buffersize', bufferSize.value);
  graph.setBufferSize(bufferSize.value);
}

/**
 * @name clickDarkMode
 * Change handler for the Dark Mode checkbox.
 */
async function clickDarkMode() {
  updateTheme();
  saveSetting('darkmode', darkMode.checked);
}

/**
 * @name changePlotType
 * Change handler for the Plot Type selector.
 */
async function changePlotType() {
  saveSetting('plottype', plotType.value);
  graph.setPlotType(plotType.value);
  reset();
  createChart();
}

/**
 * @name clickClear
 * Click handler for the clear button.
 */
async function clickClear() {
  reset();
}

/**
 * @name LineBreakTransformer
 * TransformStream to parse the stream into lines.
 */
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.container = '';
  }

  transform(chunk, controller) {
    this.container += chunk;
    const lines = this.container.split('\n');
    this.container = lines.pop();
    lines.forEach(line => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.container);
  }
}

/**
 * @name ObjectTransformer
 * TransformStream to parse the stream into a valid object.
 */
class ObjectTransformer {
  transform(chunk, controller) {
    // Log Raw Data
    logData(chunk);

    let jsobj = convertJSON(chunk)
    // Define the correct function ahead of time
    if (jsobj == chunk) {
      jsobj = convertCSV(chunk)
      addValue = addCSVValue;
    } else {
      addValue = addJSONValue;
    }
    controller.enqueue(jsobj);
  }
}

function convertJSON(chunk) {
  try {
    let jsonObj = JSON.parse(chunk);
    return jsonObj;
  } catch (e) {
    return chunk;
  }
}

function convertCSV(chunk) {
  let jsobj = {};
  jsobj.csvdata = chunk.split(",");
  return jsobj;
}

function toggleUIConnected(connected) {
  let lbl = 'Connect';
  if (connected) {
    lbl = 'Disconnect';
  }
  // serCommand.disabled = !connected
  // butSend.disabled = !connected
  butConnect.textContent = lbl;
}

function setupChart(value) {
  // Use the value as a template
  if (value.csvdata) {
    if (graph.plotType == "xt") {
      value.csvdata.forEach((item, index) => {
        dataSets.push({
          label: "",
          field: index,
          borderColor: colors[index % colors.length]
        });
      });
    } else {
      dataSets.push({
        label: "",
        field: 0,
        borderColor: colors[0]
      });
    }
  } else {
    Object.entries(value).forEach(([key, item], index) => {
      dataSets.push({
        label: key,
        field: key,
        borderColor: colors[index % colors.length],
        // color: colors[index % colors.length],
        // backgroundColor: colors[index % colors.length],
        // pointBackgroundColor: colors[index % colors.length],
      });
    });
  }

  dataSets.forEach((dataSet) => {
    graph.addDataSet(dataSet.label, dataSet.borderColor);
  });
  // console.log(graph)
  graph.update();
}

function initBaudRate() {
  for (let rate of baudRates) {
    var option = document.createElement("option");
    option.text = rate + " Baud";
    option.value = rate;
    baudRate.add(option);
  }
}

function initBufferSize() {
  for (let size of bufferSizes) {
    var option = document.createElement("option");
    option.text = size + " 数据点";
    option.value = size;
    bufferSize.add(option);
  }
}

function loadAllSettings() {
  // Load all saved settings or defaults
  // autoscroll.checked = loadSetting('autoscroll', true);
  // showTimestamp.checked = loadSetting('timestamp', false);
  // plotType.value = loadSetting('plottype', 'xt');
  graph.setPlotType('xt');
  // baudRate.value = loadSetting('baudrate', 9600);
  // bufferSize.value = loadSetting('buffersize', 500);
  graph.setBufferSize(100);
  // darkMode.checked = loadSetting('darkmode', false);
}

function loadSetting(setting, defaultValue) {
  let value = JSON.parse(window.localStorage.getItem(setting));
  if (value == null) {
    return defaultValue;
  }

  return value;
}

function saveSetting(setting, value) {
  window.localStorage.setItem(setting, JSON.stringify(value));
}

function createChart() {
  graph.create();
  // updateTheme();
}
