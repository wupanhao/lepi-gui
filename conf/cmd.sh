# 显示时钟频率，时钟可以是arm，core，h264，isp，v3d，uart，pwm，emmc，pixel，vec，hdmi，dpi之一
vcgencmd measure_clock arm

# 自动监测CPU温度
watch -n 2 vcgencmd measure_temp

# 显示电压。id可以是core，sdram_c，sdram_i，sdram_p之一，如果未指定，则默认为core
vcgencmd measure_volts

# 打印配置项 [config|int|str]
vcgencmd get_config int