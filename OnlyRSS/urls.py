from django.conf.urls import patterns, url
from django.views.generic.base import RedirectView
from OnlyRSS import settings

from OnlyRSS.views import *

handler404 = 'OnlyRSS.views.page_not_found'

urlpatterns = patterns('',
    (r'^%s(?P<path>.*)' % settings.STATIC_URL, "django.views.static.serve", {'document_root': settings.STATIC_URL}),
    (r'^favicon\.ico$', RedirectView.as_view(url='%simage/favicon.ico' % settings.STATIC_URL)),

    url(r'^$', login),
    url(r'^404/$', page_not_found),

    url(r'^about/$', about),
    url(r'^add_feed/$', add_feed),

    url(r'^del_feed_bat$', del_feed_bat),
    url(r'^del_item/$', del_item),

    url(r'^get_all_feed_list/$', get_all_feed_list),
    url(r'^del_feed$', del_feed),
    url(r'^get_feed_count$', get_feed_count),
    url(r'^get_feed_content/$', get_feed_content),

    url(r'^login_ajax$', login_ajax),
    url(r'^logout$', logout),

    url(r'^import_opml/$', import_opml),
    url(r'^index/$', login),

    url(r'^setting/$', setting),
)
