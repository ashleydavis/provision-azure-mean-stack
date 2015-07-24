echo "============== Provisioning =================="
echo "============== Setting timezone =================="
sudo timedatectl set-timezone Australia/Brisbane
echo "============== OS Update =================="
sudo apt-get update
echo "============== Software Dependencies =================="
sudo apt-get install -y git
sudo apt-get install -y mercurial
sudo apt-get install -y nodejs
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo apt-get install -y npm
sudo apt-get install -y mongodb 
sudo npm install -g -y bower 
sudo npm install -g -y pm2
sudo pm2 startup ubuntu -u $USER
echo "============== Fixing mongodb conf =================="
sudo sed -i 's/bind_ip = 127.0.0.1/#bind_ip  = 127.0.0.1/g' /etc/mongodb.conf
sudo service mongodb restart
echo "============== Creating deployment repo =================="
mkdir deployment
cd deployment
hg init
cd .hg
echo "[hooks]" >> hgrc
echo "changegroup = hg up >> ./logs/update.log; chmod +x ./Deploy/server_restart.sh; ./Deploy/server_restart.sh" >> hgrc
echo "============== Provisioning Finished =================="
