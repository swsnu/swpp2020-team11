from django.http import HttpResponse
from common.util.http_util import HttpStatusCode


def login_required(func):
    def wrapper(*args, **kwargs):
        request = args[0]
        print(request.user)
        if request.user.is_authenticated:
            return func(*args, **kwargs)
        else:
            return HttpResponse(status=HttpStatusCode.UnAuthorzied)

    return wrapper
