apt-get update
apt-get upgrade -y
apt-get install -y git
apt-get install -y curl
apt-get install -y nodejs
echo "Node: " && node -v

curl -sL https://deb.nodesource.com/setup_12.x | bash -
echo "NPM: " && npm -v
npm install
npm install -g hyper-gateway
hyper-gateway run --silent
npm install -y
node client/client.js