const WiFi = require('./wifi-connection');
test = () => {
    const wifi = new WiFi();
    wifi.getStatus().then(info => console.log(info))
    wifi.scan().then(result => {
        console.log(result)
    })
}

test()