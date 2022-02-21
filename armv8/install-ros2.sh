sudo apt update && sudo apt install curl gnupg2 lsb-release

#sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key  -o /usr/share/keyrings/ros-archive-keyring.gpg
#echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

sudo apt update && sudo apt install -y \
  build-essential \
  cmake \
  git \
  libbullet-dev \
  python3-colcon-common-extensions \
  python3-flake8 \
  python3-pip \
  python3-pytest-cov \
  python3-rosdep \
  python3-setuptools \
  python3-vcstool \
  wget
# install some pip packages needed for testing
python3 -m pip install -U \
  argcomplete \
  flake8-blind-except \
  flake8-builtins \
  flake8-class-newline \
  flake8-comprehensions \
  flake8-deprecated \
  flake8-docstrings \
  flake8-import-order \
  flake8-quotes \
  pytest-repeat \
  pytest-rerunfailures \
  pytest
# install Fast-RTPS dependencies
sudo apt install --no-install-recommends -y \
  libasio-dev \
  libtinyxml2-dev
# install Cyclone DDS dependencies
sudo apt install --no-install-recommends -y \
  libcunit1-dev

mkdir -p ~/ros2_foxy/src
cd ~/ros2_foxy
wget https://raw.githubusercontent.com/ros2/ros2/foxy/ros2.repos
vcs import src < ros2.repos

sudo rosdep init
rosdep update
rosdep install --from-paths src --ignore-src -y --os=debian:bullseye  --rosdistro foxy  --skip-keys "fastcdr rti-connext-dds-5.3.1 urdfdom_headers python3-ifcfg"
pip3 install ifcfg

cd ~/ros2_foxy/
touch src/ros/COLCON_IGNORE
touch src/ros-perception/COLCON_IGNORE
touch src/ros-planning/COLCON_IGNORE
touch src/ros-tooling/COLCON_IGNORE
touch src/ros-tracing/COLCON_IGNORE
touch src/ros-visualization/COLCON_IGNORE
touch src/ros2/rviz/COLCON_IGNORE
touch src/ros2/demos/COLCON_IGNORE
colcon build --symlink-install
