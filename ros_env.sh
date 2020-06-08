export LD_PRELOAD="/usr/lib/arm-linux-gnueabihf/libatomic.so.1"
catkin_src="$HOME/workspace/lepi-ros-server/catkin_ws/src"
catkin_dev="$HOME/workspace/lepi-ros-server/catkin_ws/devel_isolated"
py2_lib="/lib/python2.7/dist-packages"
export ROS_PACKAGE_PATH="$catkin_src/pi_driver:$catkin_src/pi_cam:$catkin_src/pi_ai"
export PYTHONPATH="$catkin_dev/pi_driver$py2_lib:$catkin_dev/pi_cam$py2_lib:$catkin_dev/pi_ai$py2_lib"
