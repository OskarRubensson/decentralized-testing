#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
################ This is the script that is run when the EC2-instances are launched ################

# install most recent docker version
sudo amazon-linux-extras install docker -y
sudo service docker start

# start ipfs daemon
sudo docker pull ipfs/go-ipfs
sudo docker run -d --name ipfs_host -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest

# start tester daemon
sudo docker build . -t="selenium"
sudo docker run --name selenium-chrome --network="host" --shm-size=5g selenium