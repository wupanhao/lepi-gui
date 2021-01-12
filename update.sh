source ~/nodejs.sh
cd ~/workspace/lepi-gui/app && npm i
cd ~/workspace/lepi-gui/server && npm i
source ~/workspace/lepi-gui/env.sh && cd ~/workspace/lepi-ros-server/catkin_ws && catkin_make
