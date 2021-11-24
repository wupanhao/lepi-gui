#/bin/bash
#/home/pi/start.sh
if [ "$DISPLAY" == ":0.0" ]; then
    echo "DISPLAY=$DISPLAY"
else
    export DISPLAY=":0.0"
    echo "set DISPLAY to $DISPLAY"
fi
xset dpms 0 0 0
xset s off
bash -c "source /home/pi/nodejs.sh && source /home/pi/env.sh && electron  /home/pi/workspace/lepi-gui/server/server.js > /tmp/gui.log &"
#DISPLAY=:0.1 konsole -p TerminalColumns=34 -p TerminalRows=19
# chromium-browser "http://localhost:8000/app" --kiosk --window-size=240,320
