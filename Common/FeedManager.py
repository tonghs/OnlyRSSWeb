#coding=utf-8
import threading
import xml
from django.core import serializers
import sys
from Common.ThreadManager import ThreadManager
from OnlyRSS.models import Feed


reload(sys)
sys.setdefaultencoding('utf-8')


class FeedManager:
    thread_manager = ThreadManager()

    def __init__(self):
        pass

    def get_feed_list(self):
        feed_list = Feed.objects.all()
        feeds_json = serializers.serialize("json", feed_list)

        return feeds_json

    def get_home_url(self, link):
        """
        获取主页url
        :param link:
        """
        index = link.find('/', 8)
        if index == -1:
            index = link.find('?', 8)
            if index == -1:
                home_url = link[0:]
            else:
                home_url = link[0:index]
        else:
            home_url = link[0:index]

        return home_url

    def handle_opml(self, req):
        try:
            xml_str = req.FILES['file'].read()
            doc = xml.dom.minidom.parseString(xml_str)
            th_list = []
            for node in doc.getElementsByTagName('outline'):
                feed_list = Feed.objects.filter(feed_url=node.getAttribute('xmlUrl'))
                if feed_list.count() == 0:
                    home_url = self.get_home_url(node.getAttribute('htmlUrl'))

                    feed = Feed(title=node.getAttribute('title'), url=home_url, feed_url=node.getAttribute('xmlUrl'),
                                icon=home_url + '/favicon.ico', user_id=req.session['user_id'])
                    feed.save()

                    while int(self.thread_manager.thread_count_dic['import_thread_count']) == self.thread_manager.thread_count_max:
                        pass
                    th = threading.Thread(target=self.thread_manager.thread_handler, args=(feed, 'import'))
                    th_list.append(th)
                    self.thread_manager.thread_count_dic['import_thread_count'] = int(self.thread_manager.thread_count_dic['import_thread_count']) + 1
                    th.start()

            self.create_opml(req)

            for th in th_list:
                th.join()

        except Exception, e:
            return

    def create_opml(self, request):
        feed_list = Feed.objects.filter(user_id=request.session['user_id'])
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n' \
              '<opml version="1.0">\n' \
              '    <head>\n' \
              '        <title>subscriptions</title>\n' \
              '        <ownerName>tonghuashuai</ownerName>\n' \
              '    </head>\n' \
              '    <body>\n'

        for feed in feed_list:
            xml += '        <outline text="' + feed.title + '"\n' \
                '            title="' + feed.title + '" type="rss"\n' \
                '            htmlUrl="' + feed.url.replace('&', '&amp;') + '"\n' \
                '            xmlUrl="' + feed.feed_url.replace('&', '&amp;') + '" />\n' \

        xml += '    </body>\n' \
            '</opml>'

        file_object = open('Resources/opml/' + request.session['username'] + str(request.session['user_id']) + '.opml', 'w')
        file_object.write(xml)
        file_object.close()