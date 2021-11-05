sudo mkdir -p /etc/X11/xorg.conf.d/
sudo cp ../conf/99-calibration.conf /etc/X11/xorg.conf.d/99-calibration.conf
sudo cp ../conf/99-fbturbo.conf /usr/share/X11/xorg.conf.d/99-fbturbo.conf
# both lcd and touch panel driver
sudo cp ./tft9341.dtbo /boot/overlays/tft9341.dtbo

#sudo bash -c "echo 'dtoverlay=tft9341:rotate=0' >> /boot/config.txt"
sudo cp ./config.txt /boot/

# print logs when boot
#sudo cp ./conf/cmdline.txt /boot/
#quiet splash plymouth.ignore-serial-consoles
sudo sed -i 's| quiet||' /boot/cmdline.txt
sudo sed -i 's| splash||' /boot/cmdline.txt
sudo sed -i 's| plymouth.ignore-serial-consoles||' /boot/cmdline.txt
sudo sed -i 's| rootwait| rootwait fbcon=map:10 fbcon=font:ProFont6x11 logo.nologo|' /boot/cmdline.txt
sudo apt install -y xserver-xorg-input-evdev xinput-calibrator
