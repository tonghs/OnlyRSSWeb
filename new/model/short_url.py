#!/usr/bin/env python
#coding: utf-8

import time
import string
import intstr
import bson
from db import Doc, redis
from misc.config import HOST


R_SHORT_URL_COUNTER = 'SHORT_URL_COUNTER'

ALPHABET = string.ascii_uppercase + string.ascii_lowercase + string.digits + '-_'
intstr_ = intstr.IntStr(ALPHABET)

domain = HOST

class ShortUrl(Doc):
    structure = dict(
        uid=int,
        url=basestring,
        md5=bson.binary.Binary,
        time=int

    )

    indexes = [
        {
            'fields': ['uid'],
        },{
            'fields': ['time'],
        },{
            'fields': ['md5'],
        }

    ]

    @classmethod
    def encode(cls, url):
        md5_ = bson.binary.Binary(md5.new(url).digest())
        su = ShortUrl.find_one(dict(md5=md5_))

        if su:
            uid = su.uid
        else:
            su = ShortUrl(dict(url=url, time=int(time.time()), md5=md5_))
            uid = cls.get_uid()
            su.upsert(dict(uid=uid))

        short_url = intstr_.encode(uid)

        return '%s%s' % (domain, short_url)

    @classmethod
    def decode(cls, s):
        url = ''
        if s:
            uid = intstr_.decode(s)
            su = ShortUrl.find_one(dict(uid=uid))
            url = su.url if su else url

        return url


    @classmethod
    def get_uid(cls):
        return redis.incr(R_SHORT_URL_COUNTER)


if __name__ == "__main__":
    url = 'http://tonghs.angelcrunch.com'
    surl = ShortUrl.encode(url)
    print surl
    print ShortUrl.decode(surl)

