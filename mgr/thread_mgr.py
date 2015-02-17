#coding=utf-8
import feedparser
from mgr.item_mgr import ItemManager

'''
线程处理，简单线程池
'''


class ThreadManager:

    thread_count_dic = {'update_thread_count': 0, 'import_thread_count': 0}
    update_thread_count = 0
    #线程限制数
    thread_count_max = 100

    item_manager = ItemManager()

    def __init__(self):
        pass

    def thread_handler(self, feed, ops):
        url = feed.feed_url
        d = feedparser.parse(url)
        if len(d.entries) > 0:
            self.item_manager.insert_to_item(d, feed)

        thread_count = int(self.thread_count_dic[ops + '_thread_count'])
        self.thread_count_dic[ops + '_thread_count'] = thread_count - 1
