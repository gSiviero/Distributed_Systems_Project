#!/bin/bash
sudo yum -y groupinstall "Development Tools"
sudo curl –sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum -y install –y nodejs
sudo npm -y install ts-node -g
sudo git clone https://github.com/gSiviero/DS_Project.git
cd DS_Project
sudo npm install
sudo ts-node System.ts