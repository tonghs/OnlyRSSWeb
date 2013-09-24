from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=200)
    name = models.CharField(max_length=30)


class Feed(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    feed_url = models.CharField(max_length=500)
    icon = models.CharField(max_length=100)
    update_date = models.DateTimeField()

    def __unicode__(self):
        return '%s' % (self.title)


    def toJSON(self):
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)

        d = {}
        for attr in fields:
            d[attr] = getattr(self, attr)

        import json
        return json.dumps(d)


class Item(models.Model):
    title = models.CharField(max_length=500)
    url = models.CharField(max_length=500)
    content = models.TextField()
    feed = models.ForeignKey(Feed)
    pub_date = models.DateTimeField()
    user = models.ForeignKey(User)
    state = models.IntegerField()
