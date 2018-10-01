ssh conoha-http 'rm -rf /var/www/vhosts/1day-release.cf/htdocs/minder'
ssh conoha-http 'mkdir /var/www/vhosts/1day-release.cf/htdocs/minder'
scp -r ./* conoha-http:/var/www/vhosts/1day-release.cf/htdocs/minder
