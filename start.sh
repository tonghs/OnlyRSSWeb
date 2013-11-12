killall -9 'uwsgi -x rss.xml'
find . -name "*.pyc" | xargs rm -rf
uwsgi -x rss.xml
nginx -s reload