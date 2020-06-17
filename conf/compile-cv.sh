#pip3 install opencv-python
#sudo apt install libjasper1 libqt4-dev libatlas3-base

sudo apt-get install build-essential cmake pkg-config libjpeg-dev libtiff5-dev libjasper-dev libpng12-dev \
	libavcodec-dev libavformat-dev libswscale-dev libv4l-dev \
	libxvidcore-dev libx264-dev libatlas-base-dev gfortran \
	python2.7-dev python3-dev

cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D OPENCV_LIBTENGINE_ROOT_DIR=/home/pi/workspace/Tengine-tengine-opencv/install \
    -D WITH_TENGINE=ON \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-4.3.0/modules \
    -D ENABLE_NEON=ON \
    -D ENABLE_VFPV3=ON \
    -D BUILD_TESTS=OFF \
    -D INSTALL_PYTHON_EXAMPLES=OFF \
    -D OPENCV_ENABLE_NONFREE=ON \
    -D CMAKE_SHARED_LINKER_FLAGS='-latomic' \
    -D BUILD_EXAMPLES=OFF ..

cmake -DOPENCV_ENABLE_NONFREE=ON \
    -D BUILD_EXAMPLES=OFF \
    -D BUILD_PERF_TESTS=OFF \
    -D BUILD_TESTS=OFF \
    -D BUILD_DOCS=OFF \
    -D WITH_CUDA=OFF \
    -D CMAKE_BUILD_TYPE=release \
    -D ENABLE_PROFILING=OFF \
    -D WITH_TENGINE=ON  \
    -D WITH_TBB=OFF \
    -D WITH_IPP=OFF \
    -D WITH_OPENCL=OFF \
    -D ENABLE_VFPV3=ON \
    -D ENABLE_NEON=ON  ..
