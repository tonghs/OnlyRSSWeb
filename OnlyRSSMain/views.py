#coding=utf-8
from django.shortcuts import render_to_response
from django.core import serializers
from django.http import HttpResponse
import feedparser
import json
import time
from models import *


def index(request):
    """
    主页
    :param request:
    :return:
    """
    return render_to_response('index.html')


def get_all_feed_list(request):
    """
    获取所有订阅列表

    :param request:
    """
    feeds = get_feed_list()

    return HttpResponse(feeds)


def get_feed_content(request):
    """
    获取指定订阅的文章
    :param request:
    :return:
    """
    feed_id = request.GET.get('id')
    item_list = Item.objects.select_related().filter(feed_id=feed_id).order_by('-pub_date')
    list_temp = []

    for item in item_list:
        dicItem = {'id': item.id, 'title': item.title, 'content': item.content, 'url': item.url, 'feed_title': item.feed.title,
                   'feed_url': item.feed.url}
        list_temp.append(dicItem)

    items_json = json.dumps(list_temp)

    return HttpResponse(items_json)


def get_all_feed_content(request):
    """
    获取所有订阅文章
    :param request:
    :return:
    """
    item_list = Item.objects.select_related().all().order_by('-pub_date')
    list_temp = []

    for item in item_list:
        dicItem = {'id': item.id, 'title': item.title, 'content': item.content, 'url': item.url, 'feed_title': item.feed.title,
                   'feed_url': item.feed.url}
        list_temp.append(dicItem)

    items_json = json.dumps(list_temp)

    return HttpResponse(items_json)


def add_feed(request):
    """
    添加订阅
    :param request:
    """
    url = request.GET.get('url')
    d = feedparser.parse(url)

    feed_list = Feed.objects.filter(feed_url=url)
    if feed_list.count() == 0:
        home_url = get_home_url(d.feed.link)

        feed = Feed(title=d.feed.title, url=d.feed.link, feed_url=url, icon=home_url + '/favicon.ico')
        feed.save()

        for entry in d.entries:
            pub_date = time.strftime('%Y-%m-%d %X', entry.updated_parsed)
            item = Item(title=entry.title, url=entry.link, content=entry.description, pub_date=pub_date,
                        feed_id=feed.id, user_id=1, state=0)
            item.save()

    return HttpResponse('success')


def get_feed_list():
    """
    获取订阅列表

    :return:
    """
    feed_list = Feed.objects.all()
    feeds_json = serializers.serialize("json", feed_list)

    return feeds_json


def get_home_url(link):
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