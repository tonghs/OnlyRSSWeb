#!/usr/bin/env python
#coding:utf-8

from _base import route, BaseHandler

@route('/')
class index(BaseHandler):
    def get(self):
        self.render()
