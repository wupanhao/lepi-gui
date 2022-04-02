# Install ROS Runtime
# sudo apt install -y python-rospy python-rosnode python-roslaunch ros-core

# pi4_driver_node
pip3 install evdev

# camera node
sudo apt install -y python3-cv-bridge python3-opencv fonts-wqy-zenhei

# apriltag node
sudo apt install -y libopenblas-base liblapack-dev
sudo apt install -y libatlas3-base libgfortran5
pip3 install dt-apriltags scipy

# pi_ai module #https://www.tensorflow.org/lite/guide/python
# pip3 install https://dl.google.com/coral/python/tflite_runtime-2.1.0.post1-cp37-cp37m-linux_armv7l.whl
# edge tpu #https://coral.ai/docs/accelerator/get-started/#1-install-the-edge-tpu-runtime
echo "deb https://packages.cloud.google.com/apt coral-edgetpu-stable main" | sudo tee /etc/apt/sources.list.d/coral-edgetpu.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt update
sudo apt install -y libedgetpu1-std python3-tflite-runtime
sudo rm /etc/apt/sources.list.d/coral-edgetpu.list

# ultra_face_inference_node
sudo apt install -y libatlas-base-dev
#pip3 install --upgrade numpy
#pip3 install opencv-python==4.5.3.56 pyyaml
#sudo apt install -y libjasper1

# face recognize node
pip3 install face_recognition

# text recognize and barcode_scanner node
pip3 install pytesseract pyzbar
sudo apt install -y tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-chi-tra
#pip install pytesseract pyzbar # for python

# smart audio node
sudo apt install mpg123 python3-pyaudio

# bluetooth node (not use for now)
# pip install pybleno pyroute2
# sudo setcap cap_net_raw+eip $(eval readlink -f `which python`)
# sudo setcap cap_net_raw+eip $(eval readlink -f `which python3`)

# run python and emulate input
sudo apt install -y konsole xdotool

# pi robot
mkdir ~/Lepi_Data
ln -s /home/pi/workspace/lepi-ros-server/catkin_ws/src/pi_robot/include/hexapod_controller ~/Lepi_Data
ln -s /home/pi/workspace/lepi-ros-server/catkin_ws/src/pi_robot/include/pupper_controller ~/Lepi_Data
pip3 install transforms3d flask-cors
# MNN
# ./configure CFLAGS="-fPIC" CXXFLAGS="-fPIC" 重新编译protobuf
# 编译MNN不要tools
# 安装pytorch 1.5 https://github.com/Ben-Faessler/Python3-Wheels/tree/master/pytorch

#sudo apt install python-image-geometry python3-image-geometry 

#DISPLAY=:0.1  xdotool mousemove --screen 1  115 300 click 1

# arecord : pulseaudio
# pocketsphinx-python : apt install libpulse-dev pulseaudio #装完重启


#unknown
#sudo apt install gfortran libgfortran5 libhdf5-dev 
#pip install --user tensorflow sklearn

