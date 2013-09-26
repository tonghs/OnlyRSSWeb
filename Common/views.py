#coding=utf-8
from django.shortcuts import render_to_response


def page_not_found(request):
    return render_to_response('404.html')