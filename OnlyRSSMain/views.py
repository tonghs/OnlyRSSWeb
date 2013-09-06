#coding=utf-8
from django.shortcuts import render_to_response
from django.core import serializers
from django.http import HttpResponse
import feedparser
import json
from models import Feed


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
    #feeds_json = json.dumps(list(feed_list))
    feeds_json = serializers.serialize("json", feed_list)

    return feeds_json


def get_feed_content(request):
    url = request.GET.get('url')
    feed_dic = feedparser.parse(url)
    html = json.dumps(feed_dic.entries)

    return HttpResponse(html)
