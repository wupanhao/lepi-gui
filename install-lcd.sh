sudo mkdir -p /etc/X11/xorg.conf.d/
sudo cp ./conf/99-calibration.conf /etc/X11/xorg.conf.d/99-calibration.conf
sudo cp ./conf/99-fbturbo.conf /usr/share/X11/xorg.conf.d/99-fbturbo.conf
# lcd only without touch panel driver
sudo cp ./conf/tft9341-lcd.dtb /boot/overlays/tft9341-lcd.dtb
sudo bash -c "echo 'dtoverlay=tft9341-lcd:rotate=0' >> /boot/config.txt"
# both lcd and touch panel driver
#sudo cp ./conf/tft9341.dtb /boot/overlay/tft9341.dtb
#sudo echo "dtoverlay=tft9341:rotate=0" >> /boot/config.txt

# print logs when boot
sudo cp ./conf/cmdline.txt /boot/
sudo cp ./conf/config.txt /boot/
