#!/bin/bash

nginx

service mysql start

InitData()
{
    mysql -uroot < /root/mysql.sql
    rm /root/mysql.sql

    mkdir /root/rss
    git clone https://github.com/tonghuashuai/OnlyRSSWeb.git /root/rss

    cd /root/rss

    python manage.py syncdb

    mysql -u rss -prstfsgbcedh -e "insert into onlyrss.OnlyRSS_user (username, password, name) values ('tonghs', 'tonghs', 'tonghs');"

    echo '*/5 * * * * python /root/rss/misc/update_service.py' >> /var/spool/cron/crontabs/root

    cp misc/supervisor.conf /etc/supervisor/conf.d/rss.conf
}

Start()
{
    service supervisor start
}
if [ -f "/root/mysql.sql" ]; then 
    InitData
fi 

Start

/usr/sbin/sshd -D
