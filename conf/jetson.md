# Jetson Xavier ubuntu18.04配置vnc
## 1 安装软件
sudo apt-get install xfce4 
sudo apt-get install vnc4server
sudo apt-get install xrdp
## 2 启动服务，设置密码，~/.vnc/password
vncserver

## 3 修改~/.vnc/xstartup文件
```
#!/bin/sh
# Uncomment the following two lines for normal desktop:
# unset SESSION_MANAGER
# exec /etc/X11/xinit/xinitrc
#[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
#[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
#xsetroot -solid grey
#vncconfig -iconic &
#x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
#x-window-manager &
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
vncconfig -iconic &
xfce4-session &
```

## 4 重启服务
sudo vncserver -kill :1  #关闭当前vnc界面
vncserver  #重启vnc
sudo service xrdp restart  #重启xrdp