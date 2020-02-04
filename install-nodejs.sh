function install_from_apt(){
	sudo apt update
	sudo apt install npm -y
	# Fix npm EACCES error
	mkdir ~/.npm-global
	npm config set prefix '~/.npm-global'
	npm i -g npm
	echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/nodejs.sh
	source ~/nodejs.sh
	#/usr/local/bin/npm config set prefix '~/.npm-global'
}

function install_from_wget(){
	cd ~/workspace
	wget https://nodejs.org/dist/v12.14.1/node-v12.14.1-linux-armv7l.tar.xz
	tar -xvf node-v12.14.1-linux-armv7l.tar.xz

	echo 'export PATH=~/workspace/node-v12.14.1-linux-armv7l/bin:$PATH' >> ~/nodejs.sh
	echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/nodejs.sh
	source ~/nodejs.sh

	mkdir ~/.npm-global
	npm config set prefix '~/.npm-global'

}
# install_from_apt
install_from_wget
npm i -g electron@6.0.0
npm i -g yarn
