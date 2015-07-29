echo "============== Provisioning =================="
D=$(date +"%m_%d_%Y")
mkdir logs
LOG=./logs/provision_$D.log
echo "============== Setting timezone ==================" >> $LOG 2>&1
sudo timedatectl set-timezone Australia/Brisbane >> $LOG 2>&1
echo "============== OS Update ==================" >> $LOG 2>&1
sudo apt-get update >> $LOG 2>&1
echo "============== Software Dependencies ==================" >> $LOG 2>&1
sudo apt-get install -y git >> $LOG 2>&1
sudo apt-get install -y mercurial >> $LOG 2>&1
sudo apt-get install -y nodejs >> $LOG 2>&1
sudo ln -s /usr/bin/nodejs /usr/bin/node >> $LOG 2>&1
sudo apt-get install -y npm >> $LOG 2>&1
sudo apt-get install -y mongodb >> $LOG 2>&1
sudo npm install -g -y bower >> $LOG 2>&1
echo "============== Fixing mongodb conf ==================" >> $LOG 2>&1
sudo npm install pm2 -g --unsafe-perm >> $LOG 2>&1
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u $USER >> $LOG 2>&1
sudo chown -R $USER ./.pm2 >> $LOG 2>&1
echo "============== Fixing mongodb conf ==================" >> $LOG 2>&1
sudo sed -i 's/bind_ip = 127.0.0.1/#bind_ip  = 127.0.0.1/g' /etc/mongodb.conf >> $LOG 2>&1
sudo service mongodb restart >> $LOG 2>&1
echo "============== Creating deployment repo ==================" >> $LOG 2>&1
mkdir deployment >> $LOG 2>&1
pwd >>  $LOG 2>&1
ls >>  $LOG 2>&1
mkdir ./deployment/logs >> $LOG 2>&1
echo "Created logs dir" >>  $LOG 2>&1
hg init deployment >> $LOG 2>&1
echo "[hooks]" >> deployment/.hg/hgrc
echo "changegroup = hg up >> ./logs/update.log; chmod +x ./Deploy/server_restart.sh; ./Deploy/server_restart.sh" >> deployment/.hg/hgrc
echo "============== Provisioning Finished ==================" >> $LOG 2>&1
