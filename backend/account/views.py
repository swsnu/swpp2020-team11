import json
import random
import string

from django.http import HttpResponse, JsonResponse
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from .models import User


# Dummy function to check other functions
@ensure_csrf_cookie
@require_http_methods(['POST'])
def sign_in(request):
    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    password = req_data.get('password', None)
    # create dummy nickname and email
    nickname = ''
    for _ in range(10):
        nickname += random.choice(string.ascii_lowercase)
    email = nickname + '@gmail.com'
    user = User.objects.create_user(email, nickname, password, '010-1234-1234')
    # try:
    #     user = User.objects.get(username=username)
    # except ObjectDoesNotExist:
    #     return HttpResponse(status=HttpStatusCode.UnAuthorzied)
    # if not user.check_password(raw_password=password):
    #     return HttpResponse(status=HttpStatusCode.UnAuthorzied)
    auth.login(request, user)
    return JsonResponse(user.as_dict(), status=HttpStatusCode.Created)


@ensure_csrf_cookie
@require_http_methods(['GET'])
@login_required
def sign_out(request):
    auth.logout(request)
    return HttpResponse(status=HttpStatusCode.NoContent)
