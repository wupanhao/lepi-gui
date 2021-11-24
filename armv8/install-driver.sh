# Install LCD Driver
cat /boot/config.txt | grep tft9341
if [ $? -ne 0 ]; then
  echo "LCD Driver not install, install now"
  cd ~/workspace/lepi-gui/armv7l
  bash install-lcd.sh
else
  echo "LCD Driver installed, ignore"
fi

# Install WM8960 Audio Driver
# https://github.com/respeaker/seeed-voicecard
# https://github.com/waveshare/WM8960-Audio-HAT
arecord -l | grep wm8960
if [ $? -ne 0 ]; then
  echo "WM8960 Audio Driver not install, install now"

# Failed
#  cd ~/workspace/lepi-gui/conf/WM8960-Audio-HAT
#  sudo ./install.sh

# Success
  cd ~/workspace
  git clone https://github.com/respeaker/seeed-voicecard
  cd ~/workspace/seeed-voicecard
  sudo ./install_arm64.sh
  #sudo ./install.sh --compat-kernel
else
  echo "WM8960 Audio Driver installed, ignore"
fi

# Install OpenOcd
if [ -f ~/workspace/xpack-openocd-0.10.0-14/bin/openocd ];then
  echo "openocd installed"
else
  echo "install openocd"
  cd ~/workspace
  wget https://github.com/xpack-dev-tools/openocd-xpack/releases/download/v0.10.0-14/xpack-openocd-0.10.0-14-linux-arm.tar.gz
  tar -xvf xpack-openocd-0.10.0-14-linux-arm.tar.gz
  sudo ln ~/workspace/xpack-openocd-0.10.0-14/bin/openocd /usr/local/bin/
fi

#sudo mv /etc/profile.d/sshpwd.sh ~
#sudo mv /etc/profile.d/wifi-check.sh ~

# disable ssh warning
sudo apt purge libpam-chksshpwd -y

# disable welcome page
sudo mv /etc/xdg/autostart/piwiz.desktop ~
