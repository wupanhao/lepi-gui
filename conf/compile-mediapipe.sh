sudo apt update && sudo apt install -y python3-dev cmake protobuf-compiler python3-pip git make openjdk-11-jdk-headless

# sudo pip3 install pip setuptools --upgrade

cd ~/workspace
wget https://github.com/google/mediapipe/archive/refs/tags/v0.8.8.tar.gz -O mediapipe-0.8.8.tar.gz
tar xvf mediapipe-0.8.8.tar.gz
cd mediapipe-0.8.8

sed -i -e "/\"imgcodecs\"/d;/\"calib3d\"/d;/\"features2d\"/d;/\"highgui\"/d;/\"video\"/d;/\"videoio\"/d" third_party/BUILD
sed -i -e "/-ljpeg/d;/-lpng/d;/-ltiff/d;/-lImath/d;/-lIlmImf/d;/-lHalf/d;/-lIex/d;/-lIlmThread/d;/-lrt/d;/-ldc1394/d;/-lavcodec/d;/-lavformat/d;/-lavutil/d;/-lswscale/d;/-lavresample/d" third_party/BUILD

sed -i -e "/^        # Optimization flags/i \        \"ENABLE_NEON\": \"OFF\"," third_party/BUILD
sed -i -e "/^        # Optimization flags/i \        \"WITH_TENGINE\": \"OFF\"," third_party/BUILD

python3 setup.py gen_protos
bazel clean --expunge
python3 setup.py bdist_wheel
