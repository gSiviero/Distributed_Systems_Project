#!/bin/bash
sudo apt update
sudo apt -y install mysql-server
sudo systemctl start mysql.service
sudo apt-get -y install nodejs
