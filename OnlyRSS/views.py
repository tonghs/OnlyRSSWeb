#coding=utf-8
import json
import re
import urllib
from django.db.models import Count
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext
import feedparser


from Common.FeedManager import FeedManager
from Common.ItemManager import ItemManager
from Common.ThreadManager import ThreadManager
from Common.UserManager import UserManager
from models import *
from forms import UploadFileForm
from Only.settings import APP, SLOGAN


#cookie超时时间 秒
max_age = 2592000
user_manager = UserManager()
feed_manager = FeedManager()
thread_manager = ThreadManager()
item_manager = ItemManager()


def login(request):
    if 'username' in request.COOKIES and 'password' in request.COOKIES:
        username = request.COOKIES['username']
        password = request.COOKIES['password']
        if user_manager.valid(request, username, password):
            response = render_to_response('index.html', dict(username=request.session['username'], app=APP, slogan=SLOGAN))
            response.set_cookie('username', username, max_age)
            response.set_cookie('password', password, max_age)
        else:
            response = render_to_response('login.html')
            response.delete_cookie('username')
            response.delete_cookie('password')
    else:
        response = render_to_response('login.html')

    return response


def logout(request):
    del request.session['username']
    del request.session['password']
    del request.session['user_id']
    response = HttpResponse('success')
    response.delete_cookie('password')

    return response


def login_ajax(request):
    username = request.REQUEST.get('username')
    password = request.REQUEST.get('password')
    msg = 'fail'

    if user_manager.valid(request, username, password):
        msg = 'success'

    return HttpResponse(msg)


def get_all_feed_list(request):
    """
    获取所有订阅列表

    :param request:
    """
    feeds = feed_manager.get_feed_list()

    return HttpResponse(feeds)


def get_feed_content(request):
    """
    获取指定订阅的文章
    :param request:
    :return:
    """
    feed_id = int(request.GET.get('id'))

    page_size = 10
    start = 0
    end = page_size

    if feed_id != 0:
        item_list = Item.objects.select_related().filter(feed_id=feed_id).order_by('-pub_date')[start:end]
    else:
        item_list = Item.objects.select_related().all().order_by('-pub_date')[start:end]
    list_temp = []

    for item in item_list:
        content = item.content.replace('<a ', '<a target=_blank ')
        dic_item = {'id': item.id, 'title': item.title, 'content': content, 'url': item.url,
                    'feed_title': item.feed.title,
                    'feed_url': item.feed.url}
        list_temp.append(dic_item)

    items_json = json.dumps(list_temp).replace('src', 'src_no')

    return HttpResponse(items_json)


def add_feed(request):
    """
    添加订阅
    :param request:
    """
    url = urllib.unquote(request.GET.get('url'))
    d = feedparser.parse(url)

    feed_list = Feed.objects.filter(feed_url=url)
    if feed_list.count() == 0:
        home_url = feed_manager.get_home_url(d.feed.link)

        feed = Feed(title=d.feed.title, url=d.feed.link, feed_url=url, icon=feed_manager.get_icon(home_url), user_id=1)
        feed.save()
        if len(d.entries) > 0:
            item_manager.insert_to_item(d, feed)

    feed_manager.create_opml(request)

    return HttpResponse('success')


def del_item(request):
    """
    删除文章
    """
    msg = 'success'
    item_id = request.GET.get('id')
    if item_id and int(item_id) > 0:
        try:
            item = get_object_or_404(Item, pk=int(item_id))
            item.delete()
        except Http404 as e:
            msg = ''
    else:
        item = Item.objects.all()
        item.delete()

    return HttpResponse(msg)


def del_feed(request):
    feed_id = request.GET.get('id')
    if feed_id and int(feed_id) > 0:
        try:
            feed = get_object_or_404(Feed, pk=int(feed_id))
            feed.delete()
        except Http404, e:
            pass
    elif not feed_id:
        Feed.objects.all().delete()

    feed_manager.create_opml(request)

    return HttpResponse('success')


def del_feed_bat(request):
    ids_str = request.GET.get('ids_str')
    Feed.objects.extra(where=['id IN (' + ids_str + ')']).delete()

    feed_manager.create_opml(request)

    return HttpResponse('success')


def setting(request):
    if 'user_id' in request.session:
        username = request.session['username']
        opml_url = '/resources/opml/' + request.session['username'] + str(request.session['user_id']) + '.opml'
        response = render_to_response('setting.html', {'username': username, 'opml_url': opml_url},
                                      context_instance=RequestContext(request))
    else:
        response = HttpResponseRedirect('/')

    return response


def about(request):
    return render_to_response('about.html')


def app(request):
    if 'username' not in request.session:
        username = ''
    else:
        username = request.session['username']

    return render_to_response('app.html', {'username': username})


def import_opml(request):
    """

    @param request:
    @return:
    """
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            feed_manager.handle_opml(request)
    return HttpResponseRedirect('/')


def get_feed_count(request):
    feed_title_qs = Feed.objects.all()

    list_feed_id = []
    list_feed_title = []

    for feed in feed_title_qs:
        list_feed_id.append(feed.id)
        list_feed_title.append(feed.title)

    feed_count_qs = Item.objects.select_related().all().values('feed').annotate(
        count=Count('feed'))

    list_feed_count = []
    for item in feed_count_qs:
        dic_item = {'feed': item['feed'], 'feed_title': list_feed_title[list_feed_id.index(item['feed'])],
                    'count': item['count']}
        list_feed_count.append(dic_item)

    items_json = json.dumps(list(list_feed_count))

    return HttpResponse(items_json)
