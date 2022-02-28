sudo apt install git libbluetooth-dev checkinstall libusb-dev joystick pkg-config -y
cd ~/workspace
git clone https://github.com/RetroPie/sixad.git
cd ~/workspace/sixad
sudo mkdir -p /var/lib/sixad/profiles
make
sudo checkinstall