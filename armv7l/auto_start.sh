#Log path:/home/pi/.cache/lxsession/LXDE-pi/run.log
mkdir -p ~/.config/autostart
cp ../conf/gui.desktop ~/.config/autostart/
cp ./env.sh ~/
cp ./start.sh ~/
#chmod +x ~/start.sh
#cp ./conf/nodejs.sh ~/
