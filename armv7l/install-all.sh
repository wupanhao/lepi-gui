set -x

date > /tmp/time.log

# Clone the Repo
mkdir ~/workspace
cd ~/workspace
git clone https://github.com/wupanhao/lepi-gui
git clone https://github.com/wupanhao/lepi-ros-server

# Install Driver
bash ~/workspace/lepi-gui/install_driver.sh

<<COMMENT
# Install Docker
docker -v
if [ $? -ne 0 ]; then
  echo "Docker not install, install now~"
  curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh
  sudo usermod -aG docker pi
else
  echo "Docker installed, ignore"
fi
COMMENT
# Pull Docker Image
# sudo docker pull wupanhao/lepi_driver

# Compile ROS Workspace
# Before, change the swap size
# sudo sed -i 's|CONF_SWAPSIZE=100$|CONF_SWAPSIZE=1000|' /etc/dphys-swapfile
# sudo service dphys-swapfile restart
# sudo docker run --rm -t -v /home/pi:/home/pi wupanhao/lepi_driver bash -c "source /ros_entrypoint.sh && cd /home/pi/workspace/lepi-ros-server/catkin_ws/ && catkin_make_isolated"

# Install Other
mkdir -p /home/pi/Lepi_Data
touch /home/pi/Lepi_Data/.variable.yaml

#pip install --user PyUserInput

# Install Node.js Environment
node -v
if [ $? -ne 0 ]; then
  echo "nodejs not install, install now"
  cd ~/workspace/lepi-gui/armv7l
  bash install-nodejs.sh
else
  echo "nodejs installed, ignore"
fi
# Install GUI
source ~/nodejs.sh
cd ~/workspace/lepi-gui/server && npm i && electron-rebuild
cd ~/workspace/lepi-gui/app && npm i

# Set GUI Auto Start
# cd ~/workspace/lepi-gui
# bash auto_start.sh

date >> /tmp/time.log
