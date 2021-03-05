#!/bin/bash
mkdir ~/.homeassistant
docker run  -idt  --name="home-assistant" -v /home/pi/.homeassistant:/config  --net=host homeassistant/home-assistant

#token:e30a90ef532f9ce08e0458dbbae29ce1549338b2
cd ~
sudo apt-get install jq git zip -y
wget `curl -sL https://api.github.com/repos/hacs/integration/releases/latest | jq -r '.assets[].browser_download_url'`
mkdir -p ~/.homeassistant/custom_components/hacs
unzip hacs.zip -d ~/.homeassistant/custom_components/hacs
rm -rf hacs.zip
# mi_tts
#https://github.com/5high/mi_tts
#hello_miai:
#  miid: '13123456789'
#  password: 'password'
# call service
#wait_time: 0
#miai_num: 0
#message: 你好，我不是小爱。

# 米家蓝牙温湿度计2 LYWSD03MMC
# 向0x0038 写01:00, 就会定期汇报温度和湿度0x0036 温度低位:温度高位:湿度:Uknown:Uknown

# 小米人体传感器2 RTCGQ02LM
# 向0x0038 写01:00, 就会定期汇报温度和湿度0x0036 温度低位:温度高位:湿度:Uknown:Uknown