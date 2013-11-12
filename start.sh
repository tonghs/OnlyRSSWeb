killall -9 uwsgi
find . -name "*.pyc" | xargs rm -rf
uwsgi -x socket.xml
nginx -s reload
