#!/bin/bash
################ This is the script that is run when the EC2-instances are launched ################

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
source ~/.bashrc
nvm install node
sudo yum -y update
sudo yum -y install git
git clone https://github.com/OskarRubensson/decentralized-testing.git
cd decentralized-testing
npm install -g hyper-gateway
hyper-gateway run --silent &


# install most recent package
sudo amazon-linux-extras install docker -y
# start the service docker
sudo service docker start
sudo docker build . -t="selenium"
sudo docker run --name selenium-chrome --network="host" --shm-size=5g selenium