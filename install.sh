mysql -u root -padmin < dockerfile/mysql.sql
python manage.py syncdb

mysql -u rss -prstfsgbcedh -e "insert into onlyrss.OnlyRSS_user (username, password, name) values ('tonghs', 'tonghs', 'tonghs');"
