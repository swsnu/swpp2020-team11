from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode
import json
from .models import *
from django.utils import timezone
from account.models import User

# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan(request):
    return HttpResponse(status=HttpStatusCode.NoContent)

@require_http_methods(['GET'])
def history(request):
    if request.method == 'GET':
        plans = Plan.objects.order_by('started_at').filter(user_id=1)
        halfdayoff = HalfDayOff.objects.filter(id__in=[plan.id for plan in plans])
        activity = []
        dinner = []
        scene = []

        places = []
        for i in range(len(halfdayoff)):
            place = []
            dayoff = halfdayoff[i]
            act = dayoff.activity.place
            place.append({ "id": act.id, "lat": act.latitude, "lng": act.longitude, "name": act.name })
            din = dayoff.dinner.place
            place.append({ "id": din.id, "lat": din.latitude, "lng": din.longitude, "name": din.name })
            sce = dayoff.scenary.place
            place.append({ "id": sce.id, "lat": sce.latitude, "lng": sce.longitude, "name":sce.name })
            date = plans[i].started_at + timezone.timedelta(hours=9)
            places.append({ "id": halfdayoff[i].id, "place": place, "date": date.strftime("%Y-%m-%d") })
        return JsonResponse({ "history": places }, status = 200)

@require_http_methods(['GET', 'POST'])
def review(request):
    if request.method == 'GET':
        reviews = Review.objects.filter(user_id=1)
        review = [review.asdict() for review in reviews]
        return JsonResponse({'review':review}, status = 200)
    elif request.method == 'POST':
        req_data = json.loads(request.body.decode())
        reviews = req_data.get('review', None)
        user = User.objects.get(id=1)
        places = Place.objects.filter(id__in=[review.get('place') for review in reviews])
        for i in reviews:
            place = places.get(id=i.get('place'))
            review = Review(user = user, place = place, score = i.get('score'), content = i.get('content'))
            review.save()
        return JsonResponse({'review': reviews}, status=201)
    
def reviewDetail(request, id):
    if request.method == 'GET':
        reviews = Review.objects.get(id=id)
        plan = HalfDayOff.objects.get(id=reviews.plan_id)
        activityReview = Review.objects.get(user_id=1, place_id=plan.activity.place_id)
        dinnerReview = Review.objects.get(user_id=1, place_id=plan.dinner.place_id)
        scenaryReview = Review.objects.get(user_id=1, place_id=plan.scenary.place_id)
        detail = [activityReview.asdict(), dinnerReview.asdict(), scenaryReview.asdict()]
        return JsonResponse({'reviewDetail': detail}, status=200)
    elif request.method == 'PUT':
        req_data = json.loads(request.body.decode())
        modifyReview = Review.objects.get(id=id)
        modifyReview.score = req_data.get('score', None)
        modifyReview.content = req_data.get('content', None)
        modifyReview.save()
        print(modifyReview.asdict())
        return JsonResponse(modifyReview.asdict(), status = 201)

        
    
