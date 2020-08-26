#! /bin/bash

if [ "$1" == "" ]; then
	echo "usage: flash-firmware.sh <firmware_filename>"
else
	~/workspace/xpack-openocd-0.10.0-14/bin/openocd -c "set FIRMWARE_FILE $1" -f ~/workspace/lepi-gui/conf/lepi-d51.cfg
fi
