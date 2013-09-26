from django.conf.urls import patterns, include, url
from django.views.generic.base import RedirectView

from OnlyRSSMain.views import index
from OnlyRSSMain.views import *
from Common.views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

handler404 = 'Common.views.page_not_found'

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'OnlyRSS.views.home', name='home'),
    # url(r'^OnlyRSS/', include('OnlyRSS.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    ('^resources/(?P<path>.*)', "django.views.static.serve", {'document_root': './Resources'}),
    url(r'^$', index),
    (r'^favicon\.ico$', RedirectView.as_view(url='resources/image/favicon.ico')),
    url(r'^index/$', index),
    url(r'^get_all_feed_list/$', get_all_feed_list),
    url(r'^get_feed_content/$', get_feed_content),
    url(r'^add_feed/$', add_feed),
    url(r'^del_item/$', del_item),
    url(r'^update_content/$', update_content),
    url(r'^setting/$', setting),
    url(r'^app/$', app),
    url(r'^about/$', about),
    url(r'^import_opml/$', import_opml),
    url(r'^404/$', page_not_found),
)
