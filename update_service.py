#!/user/bin/python
#coding=utf-8

import threading
import MySQLdb
import feedparser
import time

__author__ = 'tonghuashuai'


thread_count_dic = {'update_thread_count': 0, 'import_thread_count': 0}
update_thread_count = 0
#线程限制数
thread_count_max = 10


def main():
    sql = 'select id, feed_url, update_date from OnlyRSS_feed'
    ds = query_by_sql(sql)

    feed_list = list(ds)
    th_list = []
    for feed in feed_list:
        while int(thread_count_dic['update_thread_count']) == thread_count_max:
            pass
        th = threading.Thread(target=thread_handler, args=(feed, 'update',))
        th_list.append(th)
        thread_count_dic['update_thread_count'] = int(thread_count_dic['update_thread_count']) + 1
        th.start()


def thread_handler(feed, ops):
    url = feed[1]
    d = feedparser.parse(url)
    if len(d.entries) > 0:
        insert_to_item(d, feed)

    thread_count = int(thread_count_dic[ops + '_thread_count'])
    thread_count_dic[ops + '_thread_count'] = thread_count - 1


def insert_to_item(d, feed):
    local_date = feed[2]
    if hasattr(d.entries[0], 'published_parsed'):
        pub_date = time.strftime('%Y-%m-%d %X', d.entries[0].published_parsed)
    else:
        pub_date = time.strftime('%Y-%m-%d %X', d.entries[0].updated_parsed)

    if local_date is None or pub_date > local_date:
        sql = 'update OnlyRSS_feed set update_date = "%s" where id = %d' % (pub_date, int(feed[0]))
        execute(sql)

        items = []
        for entry in d.entries:
            if hasattr(entry, 'published_parsed'):
                pub_date = time.strftime('%Y-%m-%d %X', entry.published_parsed)
            else:
                pub_date = time.strftime('%Y-%m-%d %X', entry.updated_parsed)

            if local_date is None or pub_date > local_date:
                items.append((entry.title, entry.link, entry.description, pub_date, feed[0], 1, 0))

        sql = 'insert into OnlyRSS_item (title, url, content, pub_date, feed_id, user_id, state) values(%s,%s,%s,%s,%s,%s,%s)'
        execute_many(sql, items)


def get_conn():
    conn = MySQLdb.connect(host='localhost', user='root', passwd='admin', db='onlyrss', charset="utf8")

    return conn


def query_by_sql(sql):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(sql)
    ds = cursor.fetchall()

    cursor.close()
    conn.close()

    return ds


def execute(sql):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute(sql)

    conn.commit()
    cursor.close()
    conn.close()


def execute_many(sql, param):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.executemany(sql, param)

    conn.commit()
    cursor.close()
    conn.close()


if __name__ == '__main__':
    main()