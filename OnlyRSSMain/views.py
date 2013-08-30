#coding=utf-8
from django.shortcuts import render_to_response


def index(request):
    """
    主页
    :param request:
    :return:
    """
    return render_to_response('index.html', {'test': 'hello world'})
