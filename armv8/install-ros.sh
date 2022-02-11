sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
sudo apt update

sudo apt-get install python3-rosdep2 python3-rosinstall-generator python3-vcstools python3-wstool build-essential libgpgme-dev

sudo rosdep init
rosdep update

mkdir -p ~/ros_catkin_ws
cd ~/ros_catkin_ws

rosinstall_generator ros_comm rosbridge_server  --rosdistro noetic --deps --wet-only --tar > noetic-custom_ros.rosinstall
wstool init src noetic-custom_ros.rosinstall
#wstool update -j4 -t src
rosdep install -y --from-paths src --ignore-src --rosdistro noetic --skip-keys="python3-catkin-pkg-modules python3-rosdep-modules"  -r --os=debian:bullseye
sudo ./src/catkin/bin/catkin_make_isolated --install -DCMAKE_BUILD_TYPE=Release --install-space /opt/ros/noetic
#echo "source ~/env.sh" >> ~/nodejs.sh
