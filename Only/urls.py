from django.conf.urls import patterns, include, url
from django.views.generic.base import RedirectView

from OnlyRSS.views import *
from Common.views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

handler404 = 'Common.views.page_not_found'

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'Only.views.home', name='home'),
    # url(r'^Only/', include('Only.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
    ('^resources/(?P<path>.*)', "django.views.static.serve", {'document_root': './Resources'}),
    (r'^favicon\.ico$', RedirectView.as_view(url='resources/image/favicon.ico')),

    url(r'^$', login),
    url(r'^404/$', page_not_found),

    url(r'^about/$', about),
    url(r'^add_feed/$', add_feed),
    url(r'^app/$', app),

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
