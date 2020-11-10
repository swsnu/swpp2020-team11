import json
<<<<<<< HEAD
import random
import string

from django.http import HttpResponse, JsonResponse
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist
=======

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError
>>>>>>> 20d9aff5c806de45837012560d54c470ef42127e

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from .models import User


@ensure_csrf_cookie
@require_http_methods(['POST'])
def sign_in(request):
    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    password = req_data.get('password', None)
    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        return HttpResponse(status=HttpStatusCode.NoContent)
    if not user.check_password(raw_password=password):
        return HttpResponse(status=HttpStatusCode.UnAuthorized)
    auth.login(request, user)
    return JsonResponse(user.as_dict(), status=HttpStatusCode.Created)


@ensure_csrf_cookie
@require_http_methods(['GET'])
@login_required
def sign_out(request):
    auth.logout(request)
    return HttpResponse(status=HttpStatusCode.NoContent)


@ensure_csrf_cookie
@require_http_methods(['GET', 'POST'])
def sign_up(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse(request.user.as_dict(), status=HttpStatusCode.OK)
        return HttpResponse(status=HttpStatusCode.UnAuthorized)

    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    try:
        if User.objects.get(email=email):
            return HttpResponse(status=HttpStatusCode.UnAuthorized)
    except ObjectDoesNotExist:
        nickname = req_data.get('nickname', None)
        password = req_data.get('password', None)
        phone_number = req_data.get('phoneNumber', "")
        new_user = User.objects.create_user(email, nickname, password, phone_number)
        return JsonResponse(new_user.as_dict(), status=HttpStatusCode.Created)
