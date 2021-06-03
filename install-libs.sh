# Install ROS Runtime
# sudo apt install -y python-rospy python-rosnode python-roslaunch ros-core

sudo cp ./conf/sitecustomize.py /usr/lib/python2.7/

# pi4_driver_node
pip install evdev

# camera node
sudo apt install -y python-cv-bridge python-opencv fonts-wqy-zenhei

# apriltag node
sudo apt install -y libopenblas-base liblapack-dev
pip install dt-apriltags scipy

# pi_ai module #https://www.tensorflow.org/lite/guide/python
# pip3 install https://dl.google.com/coral/python/tflite_runtime-2.1.0.post1-cp37-cp37m-linux_armv7l.whl
# edge tpu #https://coral.ai/docs/accelerator/get-started/#1-install-the-edge-tpu-runtime
echo "deb https://packages.cloud.google.com/apt coral-edgetpu-stable main" | sudo tee /etc/apt/sources.list.d/coral-edgetpu.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt update && sudo apt install -y libedgetpu1-std python3-tflite-runtime

# ultra_face_inference_node
sudo apt install -y libatlas-base-dev
pip3 install opencv-python pyyaml
sudo apt install -y python3-rospkg python3-cv-bridge libjasper1

# face recognize node
pip install face_recognition

# text recognize and barcode_scanner node
pip install pytesseract pyzbar
sudo apt install -y tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-chi-tra
#pip install pytesseract pyzbar # for python

# run python and emulate input
sudo apt install -y konsole xdotool

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

