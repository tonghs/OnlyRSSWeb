#!/usr/bin/env python
#coding:utf-8

from model.short_url import ShortUrl
from _base import route, BaseHandler


@route('/view/add')
class AddHandler(BaseHandler):
    def get(self):
        msg = 'test'
        self.render(msg=msg)

@route('/([a-zA-Z0-9-_]*)')
class MainHandler(BaseHandler):
    def get(self, s):
        url = ShortUrl.decode(s)
        if url:
            self.redirect(url, True)
        else:
            msg = '<div style="margin:auto; width: 400px; text-align: center; margin-top: 150px;"><p>hello world!</p><p>没有此短域名</p><div>'
            self.finish(msg)

