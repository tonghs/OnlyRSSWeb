#!/usr/bin/env python
#coding:utf-8

from _base import route, BaseHandler

@route('/get_all_feed_list')
class get_all_feed_list(BaseHandler):
    def get(self):
        """
        获取所有订阅列表
        """

        self.finish(dict())
