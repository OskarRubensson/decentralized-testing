#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
################ This is the script that is run when the EC2-instances are launched ################

# Install Node, NVM, and NPM
yum -y update

# START
sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash && export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install NVM, NPM, Node.JS & Grunt
nvm alias default 17 && nvm install 17 && nvm use 17
# nvm install 17
# nvm use 17

# Clone git-repo
sudo yum -y install git
cd /home/ec2-user/

wget https://dist.ipfs.io/go-ipfs/v0.12.2/go-ipfs_v0.12.2_linux-amd64.tar.gz
tar -xvzf go-ipfs_v0.12.2_linux-amd64.tar.gz
cd go-ipfs
sudo bash install.sh

cd ../
ipfs init
cd .ipfs
# Change config so that API and Gateway address is 0.0.0.0 instead of 127.0.0.1. So that containers can access it.
# nano config


cd ../
git clone https://github.com/OskarRubensson/decentralized-testing.git
cd decentralized-testing
npm install -g hyper-gateway
hyper-gateway run --silent --persist="false" &


# install most recent docker version
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# start ipfs daemon
# sudo docker pull ipfs/go-ipfs
# sudo docker run -d --name ipfs_host -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest

# start tester daemon
# sudo docker build . -f="Dockerfile-leechers" -t="selenium"
# sudo docker run --name selenium-chrome --network="host" --shm-size=5g selenium

docker rm --force $(docker ps -q --all)