#coding=utf-8
import time
from OnlyRSS.models import Item


class ItemManager:
    def __init__(self):
        pass

    def insert_to_item(self, d, feed):
        local_date = feed.update_date
        if hasattr(d.entries[0], 'published_parsed'):
            pub_date = time.strftime('%Y-%m-%d %X', d.entries[0].published_parsed)
        else:
            pub_date = time.strftime('%Y-%m-%d %X', d.entries[0].updated_parsed)

        if local_date is None or pub_date > local_date:
            feed.update_date = pub_date
            feed.save()

            for entry in d.entries:
                if hasattr(entry, 'published_parsed'):
                    pub_date = time.strftime('%Y-%m-%d %X', entry.published_parsed)
                else:
                    pub_date = time.strftime('%Y-%m-%d %X', entry.updated_parsed)

                if local_date is None or pub_date > local_date:
                    item = Item(title=entry.title, url=entry.link, content=entry.description, pub_date=pub_date,
                                feed_id=feed.id, user_id=0, state=0)
                    item.save()