#!/usr/bin/env python
#coding:utf-8

import os

import tornado
import tornado.ioloop
import tornado.web
from tornado.options import define, options

import controller._url
from controller._base import route

define('port', default=8080, help='run on this port', type=int)
define('debug', default=True, help='enable debug mode')

settings = dict(debug=options.debug,
                template_path=os.path.join(os.path.dirname(__file__), 'view'),
                static_path=os.path.join(os.path.dirname(__file__), 'static'))

application = tornado.web.Application(route.url_list, **settings)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
