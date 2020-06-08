#!/bin/bash
set -x
# set -o errexit
######################################################
################## TODO: settings#####################
src_device=/dev/sdb
src_root_device=/dev/sdb2 #/dev/mmcblk0p1 or /dev/root
src_boot_device=/dev/sdb1 #/dev/mmcblk0p1
#src_device=/dev/mmcblk0
#src_root_device=/dev/root
#src_boot_device=/dev/mmcblk0p1
######################################################

green="\e[32;1m"
normal="\e[0m"

install_software(){
  echo -e "${green} \ninstall software\n ${normal}"
  sudo apt-get install -y dosfstools dump parted kpartx bc
  echo -e "${green} \ninstall software complete\n ${normal}"
}

create_image(){

  echo -e "${green}create image now\n ${normal}"
  used_size=`df -P | grep $src_root_device | awk '{print $3}'`
  boot_size=`df -P | grep $src_boot_device | awk '{print $2}'`
  if [ "x${used_size}" != "x" ] && [ "x${boot_size}" != "x" ];then
    count=`echo "${used_size}*1.1+${boot_size}+2"|bc|awk '{printf("%.0f",$1)}'`
  else
    echo "device $src_root_device or $src_boot_device not exist,mount first"
    exit 0;
  fi
  echo boot size:$boot_size,used_size:$used_size,block count: $count
  echo $(($boot_size/1024+1))
  sudo dd if=/dev/zero of=backup.img bs=1k count=$count
  sudo parted backup.img --script -- mklabel msdos
  sudo parted backup.img --script -- mkpart primary fat32 1M $(($boot_size/1024+1))M #(nByte/512)s
  sudo parted backup.img --script -- mkpart primary ext4 $(($boot_size/1024+1))M -1
}
init_loop_device(){
  echo -e "${green}mount loop device and copy files to image\n${normal}"
  loop_device=`sudo losetup --show -f backup.img`
  echo $loop_device
  device=`sudo kpartx -va $loop_device`
  echo $device
  device=`echo $device | sed -E 's/.*(loop[0-9]*)p.*/\1/g' | head -1`
  # device=`echo $device |awk '{print $3}' | head -1`
  echo $device
  device="/dev/mapper/${device}"
  boot_device="${device}p1"
  root_device="${device}p2"
}

format_image(){
  sleep 2
  sudo mkfs.vfat $boot_device
  sudo mkfs.ext4 $root_device
  sleep 2
}

mount_loop_device(){
  mount_boot_to=`df -h|grep ${boot_device}|awk '{print $6}'`
  if [ "x${mount_boot_to}" == "x" ];then
    mount_boot_to="/media/boot_to"
    sudo mkdir $mount_boot_to
    sudo mount -t vfat $boot_device $mount_boot_to
  fi
  mount_root_to=`df -h|grep ${root_device}|awk '{print $6}'`
  if [ "x${mount_root_to}" == "x" ];then
    mount_root_to="/media/root_to"
    sudo mkdir $mount_root_to
    sudo mount -t ext4 $root_device $mount_root_to
  fi
  sudo rm -rf $mount_boot_to/*
  sudo rm -rf $mount_root_to/*
}

copy_boot(){
  mount_boot_src=`df -h|grep ${src_boot_device}|awk '{print $6}'`
  if [ "x${mount_boot_src}" == "x" ];then
    mount_boot_src="/media/boot_src"
    sudo mkdir $mount_boot_src
    sudo mount -t vfat $src_boot_device $mount_boot_src
  fi
  echo boot mount path: $mount_boot_src
  echo -e "${green}copy /boot${normal}"
  sudo cp -rfp ${mount_boot_src}/* $mount_boot_to
}

copy_root(){
  sudo chattr +d backup.img #exclude img file from backup(support in ext* file system)
  echo "if 'Operation not supported while reading flags on backup.img' comes up, ignore it"

  mount_root_src=`df -h|grep ${src_root_device}|awk '{print $6}'`
  if [ "x${mount_root_src}" == "x" ];then
    mount_root_src="/media/root_src"
    sudo mkdir $mount_root_src
    sudo mount -t ext4 $src_root_device $mount_root_src
  fi
  echo root mount path: $mount_root_src
  cd $mount_root_to
  echo -e "${green}copy /${normal}"
  sudo dump -0auf - ${mount_root_src} | sudo restore -rf -
}

fix_partuuid(){
  old_diskid=$(sudo fdisk -l "$src_device" | sed -n 's/Disk identifier: 0x\([^ ]*\)/\1/p')
  diskid=$(sudo fdisk -l "$loop_device" | sed -n 's/Disk identifier: 0x\([^ ]*\)/\1/p')
  sudo sed -i "s/${old_diskid}/${diskid}/" $mount_boot_to/cmdline.txt
  sudo sed -i "s/${old_diskid}/${diskid}/" $mount_root_to/etc/fstab
}

umount_loop_device(){
  sudo kpartx -d $loop_device
  sudo losetup -d $loop_device
  sudo umount $mount_boot_to
  sudo umount $mount_root_to
  sudo rmdir $mount_boot_to
  sudo rmdir $mount_root_to
}

main(){
  install_software
  if [ -f backup.img ];then
    echo 'backup.img exists, no need to create it'
    init_loop_device
  else
    create_image
    init_loop_device
    format_image
  fi
  mount_loop_device
  copy_boot
  copy_root
  fix_partuuid
  umount_loop_device
}
main
echo -e "${green}\nbackup complete\n${normal}"
