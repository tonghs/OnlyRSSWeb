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
    feeds = get_feed_list();

    return HttpResponse(feeds)


def get_feed_list():
    feed_list = Feed.objects.all()
    feeds_json = serializers.serialize("json", feed_list)

    return feeds_json


def get_feed_content(request):
    url = request.GET.get('url')
    id = request.GET.get('id')
    item_list = Item.objects.select_related().filter(feed_id=id).order_by('-pub_date')
    list = []

    for item in item_list:
        dicItem = {'title': item.title, 'content': item.content, 'url': item.url, 'feed_title': item.feed.title, 'feed_url': item.feed.url}
        list.append(dicItem)

    items_json = json.dumps(list)

    return HttpResponse(items_json)

def get_all_feed_content(request):
    item_list = Item.objects.select_related().all().order_by('-pub_date')
    list = []

    for item in item_list:
        dicItem = {'title': item.title, 'content': item.content, 'url': item.url, 'feed_title': item.feed.title, 'feed_url': item.feed.url}
        list.append(dicItem)

    items_json = json.dumps(list)

    return HttpResponse(items_json)

def add_feed(request):
    """

    :param request:
    """
    url = request.GET.get('url')
    d = feedparser.parse(url)

    feed_list = Feed.objects.filter(feed_url=url)
    if feed_list.count() == 0:
        index = d.feed.link.find('/', 8)
        if index == -1:
            index = d.feed.link.find('?', 8)
            if index == -1:
                home_url = d.feed.link[0:]
            else:
                home_url = d.feed.link[0:index]
        else:
            home_url = d.feed.link[0:index]

        feed = Feed(title=d.feed.title, url=d.feed.link, feed_url=url, icon=home_url + '/favicon.ico')
        feed.save()

        for entry in d.entries:
            pub_date = time.strftime('%Y-%m-%d %X', entry.published_parsed)
            item = Item(title=entry.title, url=entry.link, content=entry.description, pub_date=pub_date, feed_id=feed.id, user_id=1, state=0)
            item.save()

    return HttpResponse('success')

