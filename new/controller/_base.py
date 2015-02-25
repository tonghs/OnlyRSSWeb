#!/usr/bin/env python
#coding: utf-8

import tornado
import mako.lookup
import mako.template
import inspect

class Route(object):
    def __init__(self):
        self.url_list = list()

    def __call__(self, url):
        def _(cls):
            self.url_list.append((url, cls))

            return cls

        return _

route = Route()

def css(name):
    return '{0}/css/{1}.css'.format(self.static_path, name)

def js(name):
    return '{0}/js/{1}.js'.format(self.static_path, name)

class BaseHandler(tornado.web.RequestHandler):
    def initialize(self):
        template_path = self.get_template_path()
        self.lookup = mako.lookup.TemplateLookup(directories=[template_path], input_encoding='utf-8', output_encoding='utf-8')

    def render_string(self, template_path, **kwargs):
        template = self.lookup.get_template(template_path)
        namespace = self.get_template_namespace()
        namespace.update(kwargs)
        namespace.update(css=css, js=js)

        return template.render(**namespace)

    def render(self, **kwargs):
        filename = "{0}/{1}.html".format(self.__module__.replace('controller.', '').replace('.', '/'),
                                         self.__class__.__name__.replace("Handler", "")).lower()
        self.finish(self.render_string(filename, **kwargs))
