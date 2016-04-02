#!/usr/bin/env python
#coding: utf-8

import time
import string
import bson
from db import Doc
from misc.config import HOST



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




if __name__ == "__main__":
    pass

