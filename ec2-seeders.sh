#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
################ This is the script that is run when the EC2-instances are launched ################

# install most recent docker version
sudo amazon-linux-extras install docker -y
sudo service docker start

# pull ipfs-image
sudo docker pull ipfs/go-ipfs

# pull hypercore-image
sudo docker pull toastaren/hypercore:latest

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
npm install
# npm run seeder