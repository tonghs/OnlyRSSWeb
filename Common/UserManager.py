#coding=utf-8
from OnlyRSS.models import User


class UserManager:
    def __init__(self):
        pass

    def valid(self, request, username, password):
        is_success = False
        user = User.objects.filter(username=username, password=password)
        if len(user):
            request.session['username'] = username
            request.session['password'] = password
            request.session['user_id'] = user[0].id
            is_success = True

        return is_success