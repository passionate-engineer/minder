ssh conoha-develop 'forever stop /root/minder/app.js'
# ssh conoha-develop 'rm -rf /root/minder'
# ssh conoha-develop 'mkdir /root/minder'
rsync -rv --delete --exclude=node_modules ./ conoha-develop:/root/minder
ssh conoha-develop 'forever start /root/minder/app.js'
