#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
source ~/.bashrc
nvm install node
sudo yum -y update
sudo yum -y install git
git clone https://github.com/OskarRubensson/decentralized-testing.git
cd decentralized-testing
npm install
npm install -g hyper-gateway

cd /tmp/
sudo yum -y install libX11
sudo curl https://intoli.com/install-google-chrome.sh | bash
sudo mv /usr/bin/google-chrome-stable /usr/bin/google-chrome
sudo wget https://chromedriver.storage.googleapis.com/100.0.4896.20/chromedriver_linux64.zip
sudo unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/bin/chromedriver

cd ~/decentralized-testing/
hyper-gateway run --persist=false --silent &
npm run client