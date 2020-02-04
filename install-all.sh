set -x

date > /tmp/time.log

# Clone the Repo
mkdir ~/workspace
cd ~/workspace
git clone https://github.com/wupanhao/lepi_gui
git clone https://github.com/wupanhao/lepi-ros-server

# Install LCD Driver
cat /boot/config.txt | grep tft9341
if [ $? -ne 0 ]; then
  echo "LCD Driver not install, install now"
  cd ~/workspace/lepi_gui
  bash install-lcd.sh
else
  echo "LCD Driver installed, ignore"
fi
# Install WM8960 Audio Driver
cat /boot/config.txt | grep wm8960
if [ $? -ne 0 ]; then
  echo "WM8960 Audio Driver not install, install now"
  cd ~/workspace/lepi_gui/conf/WM8960-Audio-HAT
  sudo ./install.sh
# https://github.com/respeaker/seeed-voicecard
# https://github.com/waveshare/WM8960-Audio-HAT
else
  echo "WM8960 Audio Driver installed, ignore"
fi
# Install Docker
docker -v
if [ $? -ne 0 ]; then
  echo "Docker not install, install now~"
  curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh
  sudo usermod -aG docker pi
else
  echo "Docker installed, ignore"
fi
# Pull Docker Image
sudo docker pull wupanhao/lepi_server:melodic

# Install ROS Runtime
sudo apt install -y python-rospy python-rosnode python-roslaunch pulseaudio ros-core

# Compile ROS Workspace
sudo docker run --rm -t -v /home/pi:/home/pi wupanhao/lepi_server:melodic bash -c "source /ros_entrypoint.sh && cd catkin_ws/ && catkin_make_isolated"

# Install Node.js Environment
node -v
if [ $? -ne 0 ]; then
  echo "nodejs not install, install now"
  cd ~/workspace/lepi_gui
  bash install-nodejs.sh
else
  echo "nodejs installed, ignore"
fi
# Install GUI
cd ~/workspace/lepi_gui
source ~/nodejs.sh
yarn install
yarn build
cd app
yarn install

# Set GUI Auto Start
cd ~/workspace/lepi_gui
bash auto_start.sh

date >> /tmp/time.log
