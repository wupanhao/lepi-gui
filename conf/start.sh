#/bin/bash
#/home/pi/start.sh
#docker start demo_duck > /home/pi/demo_duck.log
#docker exec -t  demo_duck bash -c "source /demo_duck/env.sh && roslaunch duckietown_demos duck_service.launch"  > /tmp/duckie.log
#sleep 5
DISPLAY=:0.1 xset dpms 0 0 0
DISPLAY=:0.1 xset s off
DISPLAY=:0.1 bash -c "source /home/pi/nodejs.sh && electron  /home/pi/workspace/lepi_gui/app/app.js > /tmp/gui.log &"
#docker run -t -v /home/pi:/home/pi --net host --privileged --rm --name lepi_server wupanhao/lepi_server:melodic bash -c "source env.sh && roslaunch pi_driver lepi_server.launch" > /tmp/lepi_server.log &
#sleep 10
bash -c "source /home/pi/workspace/lepi_gui/ros_env.sh && roslaunch pi_driver pi_master_node.launch > /tmp/pi_master_node.log &"
#DISPLAY=:0.1 electron /home/pi/workspace/lepi_gui/server.js 
#dnsmasq --no-hosts --log-queries --no-resolv --address=/#/192.168.27.1 --dhcp-range=192.168.27.100,192.168.27.255,12h
#/sbin/iw phy phy0 interface add uap0 type __ap
#/sbin/iw dev uap0 del
#docker run -idt --name demo_duck --privileged --net host  --env="DISPLAY=:0.1" --volume="$HOME/.Xauthority:/root/.Xauthority:rw" wupanhao/demo_duck:v0.1
