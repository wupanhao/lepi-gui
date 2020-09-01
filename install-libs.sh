# camera node
sudo apt install python-cv-bridge python-opencv fonts-wqy-zenhei

# apriltag node
pip install dt-apriltags scipy
sudo apt install libopenblas-base

# pi_ai module #https://www.tensorflow.org/lite/guide/python
pip3 install https://dl.google.com/coral/python/tflite_runtime-2.1.0.post1-cp37-cp37m-linux_armv7l.whl
# edge tpu #https://coral.ai/docs/accelerator/get-started/#1-install-the-edge-tpu-runtime
echo "deb https://packages.cloud.google.com/apt coral-edgetpu-stable main" | sudo tee /etc/apt/sources.list.d/coral-edgetpu.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt update && sudo apt install libedgetpu1-std

# ultra_face_inference_node
pip3 install opencv-python
sudo apt install python3-rospy python3-cv-bridge libjasper1

# face recognize node
pip install --user face_recognition

# text recognize and barcode_scanner node
pip install pytesseract pyzbar
sudo apt install tesseract-ocr tesseract-ocr-chi-sim tesseract-ocr-chi-tra
#pip3 install pytesseract pyzbar # for python3

# run python and emulate input
sudo apt install konsole xdotool

#sudo apt install python-image-geometry python3-image-geometry 

#DISPLAY=:0.1  xdotool mousemove --screen 1  115 300 click 1

# arecord : pulseaudio
# pocketsphinx-python : apt install libpulse-dev pulseaudio #装完重启


#unknown
#sudo apt install libatlas-base-dev gfortran libgfortran5 libhdf5-dev 
#pip install --user tensorflow sklearn

