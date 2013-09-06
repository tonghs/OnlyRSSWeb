from django.db import models


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=200)
    name = models.CharField(max_length=30)


class Feed(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500)


class Item(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    content = models.TextField()
    feed = models.ForeignKey(Feed)
    user = models.ForeignKey(User)
