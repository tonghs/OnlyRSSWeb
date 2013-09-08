from django.conf.urls import patterns, include, url

from OnlyRSSMain.views import index
from OnlyRSSMain.views import get_all_feed_list
from OnlyRSSMain.views import get_feed_content
from OnlyRSSMain.views import add_feed
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

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
    url(r'^index/$', index),
    url(r'^get_all_feed_list/$', get_all_feed_list),
    url(r'^get_feed_content/$', get_feed_content),
    url(r'^add_feed/$', add_feed),
)
