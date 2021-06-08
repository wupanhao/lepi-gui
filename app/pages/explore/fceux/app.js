
function getQuery() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    var obj = {}
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        obj[pair[0]] = pair[1]
    }
    return obj
}

function readFileFromUrl(url) {
    //url 请求的URl
    var xhr = new XMLHttpRequest();		//定义http请求对象
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.send("userId=" + username + "&password=" + password + "&repo_type=" + type + "&repo_time=");
    xhr.responseType = "blob";  // 返回类型blob
    xhr.onload = (res) => {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        if (res.currentTarget && res.currentTarget.status === 200) {
            var blob = res.currentTarget.response;
            var reader = new FileReader();
            reader.readAsBinaryString(blob);  // 转换为base64，可以直接放入a表情href
            reader.onload = (e) => {
                console.log(e, reader.result);			//查看有没有接收到数据流
                this.currentRequest = null;
                this.handleLoaded(reader.result);
            }
        }
        else {
            console.log(res)
            // alert("出现了未知的错误!");
        }
    }
    xhr.send()
}

function readJsonFromUrl(url) {
    return new Promise(resolve => {
        //url 请求的URl
        var xhr = new XMLHttpRequest();		//定义http请求对象
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xhr.send("userId=" + username + "&password=" + password + "&repo_type=" + type + "&repo_time=");
        xhr.responseType = "blob";  // 返回类型blob
        xhr.onload = (res) => {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            if (res.currentTarget && res.currentTarget.status === 200) {
                var blob = res.currentTarget.response;
                var reader = new FileReader();
                reader.readAsText(blob);  // 转换为base64，可以直接放入a表情href
                reader.onload = (e) => {
                    console.log(e, reader.result);			//查看有没有接收到数据流
                    resolve(reader.result)
                }
            }
            else {
                console.log(res)
                resolve()
                // alert("出现了未知的错误!");
            }
        }
        xhr.send()
    })
}

function post(url, data, config) {
    return new Promise(resolve => {
        //url 请求的URl
        var xhr = new XMLHttpRequest();		//定义http请求对象
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", config.header['Content-Type']);
        // xhr.send("userId=" + username + "&password=" + password + "&repo_type=" + type + "&repo_time=");
        // xhr.responseType = "blob";  // 返回类型blob
        xhr.onload = (res) => {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
            if (res.currentTarget && res.currentTarget.status === 200) {
                let result = res.currentTarget.response;
                console.log(result)
                resolve(result)
            }
            else {
                console.log(res)
                resolve()
                // alert("出现了未知的错误!");
            }
        }
        xhr.send()
    })
}

let buttonMap = [
    [0, 'A', 0],
    [1, 'B', 1],
    [8, 'Select', 2],
    [9, 'Start', 3],
    [12, 'Up', 4],
    [13, 'Down', 5],
    [14, 'Left', 6],
    [15, 'Right', 7],
]


function getGamepad(index = 0) {
    let gamepads = navigator.getGamepads()
    for (let i = 0; i < gamepads.length; i++) {
        const element = gamepads[i];
        if (element) {
            if (index == 0) {
                return element
            } else {
                index--
            }
        }
    }
    return null
}

function getGamepadBits(index = 0) {
    let bits = 0
    let threshold = 0.5
    let gamepad = getGamepad(index)
    if (gamepad) {
        for (let i = 0; i < buttonMap.length; i++) {
            let j = buttonMap[i][0]
            if (gamepad.buttons[j].pressed) {
                bits |= 1 << buttonMap[i][2];
            }
        }
        if (gamepad.axes[0] > threshold) {
            bits |= 1 << 7;
        } else if (gamepad.axes[0] < -threshold) {
            bits |= 1 << 6;
        }
        if (gamepad.axes[1] > threshold) {
            bits |= 1 << 5
        } else if (gamepad.axes[1] < -threshold) {
            bits |= 1 << 4
        }
    }
    return bits
}


let dir = 'vertical'


// Start button and its handler.
// Calling fceux.init() below must be done from an user event handler
// (and only once) because of browser Web Audio restrictions.
// const button = document.querySelector('#button');
function start() {
    // button.style.display = 'none';

    // Initialize the instance (creates Web Audio etc.)
    fceux.init('#mycanvas');

    let game_url = getQuery()['game'] || '2048.nes'

    // Bind keyboard input events to controller 1.
    // The array index below corresponds to the button bit index.
    const keys_vertical = [
        ['KeyF', 'A', 0],
        ['KeyD', 'B', 1],
        ['KeyS', 'Select', 2],
        ['Enter', 'Start', 3],
        ['ArrowUp', 'Up', 4],
        ['ArrowDown', 'Down', 5],
        ['ArrowLeft', 'Left', 6],
        ['ArrowRight', 'Right', 7],

        ['F1', 'Select', 2],
        ['F3', 'A', 0],
        ['Escape', 'B', 1],
    ];

    const keys_left = [
        ['KeyF', 'A', 0],
        ['KeyD', 'B', 1],
        ['KeyS', 'Select', 2],
        ['Enter', 'Start', 3],
        ['ArrowUp', 'Right', 7],
        ['ArrowDown', 'Left', 6],
        ['ArrowLeft', 'Up', 4],
        ['ArrowRight', 'Down', 5],

        ['F1', 'Select', 2],
        ['F3', 'A', 0],
        ['Escape', 'B', 1],
    ];

    const keys_right = [
        ['KeyF', 'A', 0],
        ['KeyD', 'B', 1],
        ['KeyS', 'Select', 2],
        ['Enter', 'Start', 3],
        ['ArrowUp', 'Left', 6],
        ['ArrowDown', 'Right', 7],
        ['ArrowLeft', 'Down', 5],
        ['ArrowRight', 'Up', 4],

        ['F1', 'Select', 2],
        ['F3', 'A', 0],
        ['Escape', 'B', 1],
    ];

    const keysMap = {
        'vertical': keys_vertical,
        'left': keys_left,
        'right': keys_right,
    }

    const keys = keysMap[dir]

    let bits = 0;

    // Export saves to localStorage at interval.
    let saveLocalStorage = () => {
        let md5 = fceux.gameMd5();
        if (md5) {
            const saveFiles = fceux.exportSaveFiles();
            const storedSaves = {};
            for (let filename in saveFiles) {
                storedSaves[filename] = Array.from(saveFiles[filename]);
            }
            localStorage['save-' + md5] = JSON.stringify(storedSaves);
            console.log('saveLocalStorage', md5)
        }
    }

    let saveURLFiles = () => {
        return new Promise(resolve => {
            let save_url = game_url.substring(0, game_url.lastIndexOf(".") + 1) + 'nes-save'
            if (save_url) {
                const saveFiles = fceux.exportSaveFiles();
                const storedSaves = {};
                for (let filename in saveFiles) {
                    storedSaves[filename] = Array.from(saveFiles[filename]);
                }
                localStorage['save-' + save_url] = JSON.stringify(storedSaves);

                var data = new window.FormData()
                // data.append('name', filename)
                let blob = new Blob([localStorage['save-' + save_url]])
                data.append('upload_file', blob, decodeURI(save_url))
                // console.log(data)
                let ip = window.location.hostname
                if (ip) {
                    let url = `http://${ip}:8000/upload/save`
                    let config = {
                        header: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    axios.post(url, data, config).then(response => {
                        console.log(response)
                        resolve(response)
                    })

                    // console.log(saveFiles, storedSaves, localStorage)
                }
            }
        })
    }

    function keyHandler(ev) {
        console.log(ev.code)
        for (let i = 0; i < keys.length; ++i) {
            if (ev.code == keys[i][0]) {
                if (ev.type == 'keydown') {
                    bits |= 1 << keys[i][2];
                } else {
                    bits &= ~(1 << keys[i][2]);
                }
                // fceux.setControllerBits(bits);
                ev.preventDefault();
                return
            }
        }

        if (ev.code == 'F2' && ev.type == 'keydown') {
            saveLocalStorage()
            // saveURLFiles().then(res => {
            //     console.log(res)
            // })
        }
    }



    let handleGameLoaded = () => {

        // localStorage['game_md5'] = md5;

        let loadSave = () => {
            let md5 = fceux.gameMd5();
            if (md5 && localStorage.hasOwnProperty('save-' + md5)) {
                // Import saves from localStorage.
                const save = JSON.parse(localStorage['save-' + md5]);
                for (let filename in save) {
                    save[filename] = new Uint8Array(save[filename]);
                }
                fceux.importSaveFiles(save);
                console.log('load from localStorage', md5)
            }
        }
        let save_url = game_url.substring(0, game_url.lastIndexOf(".") + 1) + 'nes-save'

        readJsonFromUrl(save_url).then(data => {
            try {
                console.log(data)
                const save = JSON.parse(data);
                for (let filename in save) {
                    save[filename] = new Uint8Array(save[filename]);
                }
                if (save && save["rom.sav"].length == 8192) {
                    fceux.importSaveFiles(save);
                    console.log('load from url', save_url)
                } else {
                    loadSave()
                }

            } catch (error) {
                console.log(error)
                loadSave()
            }

            let fps = 0

            // Run the emulation update loop.
            // Use requestAnimationFrame() to synchronise to repaints.
            let updateLoop = () => {
                let input = new Uint32Array(1);
                input[0] = (getGamepadBits(1) << 24) | (getGamepadBits(1) << 18) | (getGamepadBits(1) << 8) | getGamepadBits(0) | bits
                console.log(input[0])
                fceux.setControllerBits(input[0]);
                window.requestAnimationFrame(updateLoop);
                fceux.update();
                fps++
            }
            window.requestAnimationFrame(updateLoop);


            setInterval(() => {
                console.log("fps ", fps / 60)
                fps = 0
                saveLocalStorage()
                // saveURLFiles()
            }, 60000)

        })

        window.addEventListener('keydown', keyHandler);
        window.addEventListener('keyup', keyHandler);

    }

    fceux.addEventListener('game-loaded', handleGameLoaded);

    // Download a game ROM and start it.
    fceux.downloadGame(game_url);

}

// Create the Promise for the em-fceux instance.
FCEUX().then((fceux_) => {
    // Store the instance as global.
    fceux = fceux_;
    // Display the start button.
    // button.style.display = 'block';
    let run_once = (ev) => {
        console.log(ev)
        if (ev.type == 'keydown') {
            if (ev.code == 'ArrowLeft') {
                dir = 'left'
            } else if (ev.code == 'ArrowRight') {
                dir = 'right'
            }
        }
        document.querySelector('#text').style.display = 'none'
        console.log(document.documentElement.clientWidth, document.documentElement.clientHeight)
        if (document.documentElement.clientWidth / document.documentElement.clientHeight > 312 / 240) {
            // 横屏
            // document.querySelector('body').style.flexDirection= 'column'
            document.querySelector('.container').style.height = document.documentElement.clientHeight + 'px'
            document.querySelector('.container').style.width = Math.ceil(document.documentElement.clientHeight / 240 * 312) + 'px'
        } else {
            // 竖屏
            // document.querySelector('body').style.flexDirection = 'row'
            if (dir != 'vertical') {
                // document.querySelector('.container').style.height = document.documentElement.clientWidth + 'px'
                document.querySelector('.container').style.height = document.documentElement.clientWidth + 'px';
                document.querySelector('.container').style.width = Math.ceil(document.documentElement.clientWidth / 240 * 312 + 1) + 'px'
                document.querySelector('.container').classList.add(dir)
            } else {
                document.querySelector('.container').style.height = Math.ceil(document.documentElement.clientWidth / 312 * 240) + 'px'
                document.querySelector('.container').style.width = document.documentElement.clientWidth + 'px'
            }
        }
        start()
        document.onclick = null
        document.removeEventListener('keydown', run_once)
    }
    document.onclick = run_once
    document.addEventListener('keydown', run_once)
});