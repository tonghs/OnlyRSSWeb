uwsgi -x rss.xml
uwsgi --reload ./uwsgi.pid
nginx -s reload