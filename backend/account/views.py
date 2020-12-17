import json
import random
import requests

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from .models import User, Personality, PersonalityTestQuestion, PersonalityType


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
        return HttpResponse(status=HttpStatusCode.NoContent)
    auth.login(request, user)
    return JsonResponse(user.as_dict(), status=HttpStatusCode.Created)


@ensure_csrf_cookie
@require_http_methods(['GET'])
@login_required
def sign_out(request):
    auth.logout(request)
    return HttpResponse(status=HttpStatusCode.NoContent)


@ensure_csrf_cookie
@require_http_methods(['GET'])
def token(request):
    if auth.SESSION_KEY in request.session:
        return JsonResponse(request.user.as_dict())
    return HttpResponse(status=HttpStatusCode.UnAuthorized)


@ensure_csrf_cookie
@require_http_methods(['GET', 'POST'])
def sign_up(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse(request.user.as_dict(), status=HttpStatusCode.Created)
        return HttpResponse(status=HttpStatusCode.UnAuthorized)
    req_data = json.loads(request.body.decode())
    email = req_data.get('email', None)
    nickname = req_data.get('nickname', None)
    password = req_data.get('password', None)
    phone_number = req_data.get('phoneNumber', "")
    if email is None or password is None or nickname is None:
        return HttpResponse(status=HttpStatusCode.NoContent)
    try:
        user = User.objects.create_user(email=email, password=password,
            nickname=nickname, phone_number=phone_number)
    except IntegrityError:
        return HttpResponse(status=HttpStatusCode.NoContent)
    user = User.objects.get(email=email)
    auth.login(request, user)
    return JsonResponse(user.as_dict(), status=HttpStatusCode.Created)


@ensure_csrf_cookie
@require_http_methods(['GET', 'POST'])
@login_required
def personality_check(request):
    if request.method == 'GET':
        question_list = list(PersonalityTestQuestion.objects.values('id', 'question').all())
        random.shuffle(question_list)
        answer = False
        if Personality.objects.filter(user=request.user).count()>0:
            answer = True
        return JsonResponse({
            'questions': question_list, 'answer': answer
        })
    req = json.loads(request.body.decode())
    req = [int(v) for k, v in req.items()]
    personality_answer = {'openness':req[0:5], 'cons':req[5:10], 'extro':req[10:15],
                            'agree':req[15:20], 'neuro':req[20:25]}
    res = requests.get('http://personal-ml.eba-squwmi92.ap-northeast-2.elasticbeanstalk.com/mlmodels/',
                        data=json.dumps(personality_answer))
    total_score = res.json()
    total_score = total_score.get('score', None)
    personality_type = PersonalityType.objects.all()
    for score, p_type in zip(total_score, personality_type):    #O, C, E, A, N sequence!!
        Personality(user=request.user, score=score, type=p_type).save()
    return HttpResponse()
