import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from .models import User


# Dummy function to check other functions
@ensure_csrf_cookie
@require_http_methods(['POST'])
def user(request):
    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    password = req_data.get('password', None)
    phone_number = req_data.get('phone_number', "")
    nickname = req_data.get('nickname', None)
    if email is None or password is None or nickname is None:
        return HttpResponse(status=HttpStatusCode.Forbidden)
    try:
        User.objects.create_user(email=email, password=password, nickname=nickname, phone_number=phone_number)
    except IntegrityError:
        return HttpResponse(status=HttpStatusCode.Forbidden)
    return HttpResponse(status=HttpStatusCode.Created)


# Dummy function to check other functions
@ensure_csrf_cookie
@require_http_methods(['POST'])
def sign_in(request):
    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    password = req_data.get('password', None)
    try:
        customer = User.objects.get(email=email)
    except ObjectDoesNotExist:
        return HttpResponse(status=HttpStatusCode.UnAuthorized)
    if not customer.check_password(raw_password=password):
        return HttpResponse(status=HttpStatusCode.UnAuthorized)
    auth.login(request, customer)
    return HttpResponse(status=HttpStatusCode.NoContent)


@ensure_csrf_cookie
@require_http_methods(['GET'])
@login_required
def sign_out(request):
    auth.logout(request)
    return HttpResponse(status=HttpStatusCode.NoContent)
