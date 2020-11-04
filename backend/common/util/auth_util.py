from django.http import HttpResponse
from .http_util import HttpStatusCode


def login_required(func):
    def wrapper(*args, **kwargs):
        request = args[0]
        if request.user.is_authenticated:
            return func(*args, **kwargs)
        return HttpResponse(status=HttpStatusCode.UnAuthorzied)

    return wrapper
