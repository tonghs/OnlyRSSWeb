from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField()
    name = models.CharField(max_length=30)


class Feed(models.Model):
    title = models.CharField()
    url = models.CharField()


class Item(models.Model):
    title = models.CharField()
    url = models.CharField()
    content = models.TextField()
    feed = models.ForeignKey(Feed)
    user = models.ForeignKey(User)
