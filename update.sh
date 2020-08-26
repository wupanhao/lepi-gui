pip3 install opencv-python
pip3 install tflite-runtime
cd ~/workspace
wget https://github.com/xpack-dev-tools/openocd-xpack/releases/download/v0.10.0-14/xpack-openocd-0.10.0-14-linux-arm.tar.gz
tar -xvf xpack-openocd-0.10.0-14-linux-arm.tar.gz
sudo ln ~/workspace/xpack-openocd-0.10.0-14/bin/openocd /usr/local/bin/
