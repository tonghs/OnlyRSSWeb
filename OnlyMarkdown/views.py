#coding=utf-8
from django.http import HttpResponse
from django.shortcuts import render_to_response
import markdown


def markdown_index(request):
    return render_to_response('markdown.html')


def text_to_html(text):
    return markdown.markdown(text)


def get_html(request):
    text = request.GET.get('text')
    html = text_to_html(text)
    return HttpResponse(html)