
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


// Start button and its handler.
// Calling fceux.init() below must be done from an user event handler
// (and only once) because of browser Web Audio restrictions.
// const button = document.querySelector('#button');
function start() {
    // button.style.display = 'none';

    // Initialize the instance (creates Web Audio etc.)
    fceux.init('#mycanvas');

    let game_url = getQuery()['game'] || '2048.nes'

    // Download a game ROM and start it.
    fceux.downloadGame(game_url);

    let fps = 0

    // Run the emulation update loop.
    // Use requestAnimationFrame() to synchronise to repaints.
    function updateLoop() {
        window.requestAnimationFrame(updateLoop);
        fceux.update();
        fps++
    }
    window.requestAnimationFrame(updateLoop);

    setInterval(() => {
        console.log("fps ", fps / 2)
        fps = 0
    }, 2000)

    // Bind keyboard input events to controller 1.
    // The array index below corresponds to the button bit index.
    const keys = [
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
    let bits = 0;
    function keyHandler(ev) {
        console.log(ev.code)
        for (let i = 0; i < keys.length; ++i) {
            if (ev.code == keys[i][0]) {
                if (ev.type == 'keydown') {
                    bits |= 1 << keys[i][2];
                } else {
                    bits &= ~(1 << keys[i][2]);
                }
                fceux.setControllerBits(bits);
                ev.preventDefault();
                return
            }
        }
    }
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('keyup', keyHandler);

    // Add HTML for the input keys.
    // const keysDiv = document.querySelector('#keys');
    // keysDiv.innerHTML += keys
    //   .map((key) => `${key[1]} - ${key[0]}`)
    //   .join('<br/>');
}

// Create the Promise for the em-fceux instance.
FCEUX().then((fceux_) => {
    // Store the instance as global.
    fceux = fceux_;
    // Display the start button.
    // button.style.display = 'block';
    let run_once = () => {
        document.querySelector('#text').style.display = 'none'
        console.log(document.documentElement.clientWidth, document.documentElement.clientHeight)
        if (document.documentElement.clientWidth / document.documentElement.clientHeight > 312 / 240) {
            // 横屏
            // document.querySelector('body').style.flexDirection= 'column'
            document.querySelector('.container').style.height = document.documentElement.clientHeight + 'px'
            document.querySelector('.container').style.width = document.documentElement.clientHeight / 240 * 312 + 'px'
        } else {
            // 竖屏
            // document.querySelector('body').style.flexDirection = 'row'
            document.querySelector('.container').style.height = Math.ceil(document.documentElement.clientWidth / 312 * 240) + 'px'
            document.querySelector('.container').style.width = document.documentElement.clientWidth + 'px'
        }
        start()
        document.onclick = null
        document.removeEventListener('keydown',run_once)
    }
    document.onclick = run_once
    document.addEventListener('keydown', run_once)
});