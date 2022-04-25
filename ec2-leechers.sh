#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
################ This is the script that is run when the EC2-instances are launched ################

# Install Node, NVM, and NPM
yum -y update

# START
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install NVM, NPM, Node.JS & Grunt
nvm alias default 17
nvm install 17
nvm use 17

# Clone git-repo
sudo yum -y install git
cd /home/ec2-user/
git clone https://github.com/OskarRubensson/decentralized-testing.git
cd decentralized-testing
npm install -g hyper-gateway
hyper-gateway run --silent &


# install most recent docker version
sudo amazon-linux-extras install docker -y
sudo service docker start

# start ipfs daemon
sudo docker pull ipfs/go-ipfs
sudo docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest

# start tester daemon
sudo docker build . -f="Dockerfile-leechers" -t="selenium"
sudo docker run --name selenium-chrome --network="host" --shm-size=5g selenium