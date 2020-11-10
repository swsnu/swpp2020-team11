import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from account.models import User
from .models import Plan, HalfDayOff, Review, Place


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan(request):
    return HttpResponse(status=HttpStatusCode.NoContent)

@require_http_methods(['GET'])
@login_required
def history(request):
    plans = Plan.objects.order_by('started_at').filter(user_id=request.user.id)
    halfdayoff = HalfDayOff.objects.filter(id__in=[plan.id for plan in plans])
    places = []
    for index, half in enumerate(halfdayoff):
        place = []
        dayoff = half
        act = dayoff.activity.place
        place.append({ "id": act.id, "lat": act.latitude, "lng": act.longitude, "name": act.name,
            "img_urls":act.image_urls, "tag": [feature.feature_name for feature in act.features.all()] })
        din = dayoff.dinner.place
        place.append({ "id": din.id, "lat": din.latitude, "lng": din.longitude, "name": din.name,
            "img_urls":din.image_urls, "tag": [feature.feature_name for feature in din.features.all()] })
        sce = dayoff.scenary.place
        place.append({ "id": sce.id, "lat": sce.latitude, "lng": sce.longitude, "name":sce.name,
            "img_urls":sce.image_urls, "tag": [feature.feature_name for feature in sce.features.all()] })
        date = plans[index].started_at + timezone.timedelta(hours=9)
        places.append({ "id": half.id, "place": place, "date": date.strftime("%Y-%m-%d") })
    return JsonResponse({ "history": places }, status = 200)

@require_http_methods(['GET', 'POST'])
@login_required
def review(request):
    if request.method == 'GET':
        reviews = Review.objects.filter(user_id=request.user.id)
        review_all = [review.asdict() for review in reviews]
        return JsonResponse({'review':review_all}, status = 200)

    req_data = json.loads(request.body.decode())
    reviews = req_data.get('review', None)
    user = User.objects.get(id=request.user.id)
    places = Place.objects.filter(id__in=[review.get('place') for review in reviews])
    plan_review = Plan.objects.get(id=reviews[0].get('plan'))
    new_review=[]
    for i in reviews:
        place = places.get(id=i.get('place'))
        review_save = Review(user = user, place = place, plan = plan_review,
                                score = i.get('score'), content = i.get('content'))
        review_save.save()
        new_review.append(review_save.asdict())
    return JsonResponse({'review': new_review}, status=201)

@require_http_methods(['GET', 'PUT'])
@login_required
def review_detail(request, ids):
    if request.method == 'GET':
        reviews = Review.objects.get(id=ids)
        plans = HalfDayOff.objects.get(id=reviews.plan_id)
        user_id = request.user.id
        activity_place = plans.activity.place
        activity_review = Review.objects.get(user_id=user_id, place_id=activity_place.id).asdict()
        activity_review['url'] = activity_place.image_urls
        activity_review['name'] = activity_place.name
        activity_review['tag'] = [feature.feature_name for feature in activity_place.features.all()]
        dinner_place = plans.dinner.place
        dinner_review = Review.objects.get(user_id=user_id, place_id=dinner_place.id).asdict()
        dinner_review['url'] = dinner_place.image_urls
        dinner_review['name'] = dinner_place.name
        dinner_review['tag'] = [feature.feature_name for feature in dinner_place.features.all()]
        scenary_place = plans.scenary.place
        scenary_review = Review.objects.get(user_id=user_id, place_id=scenary_place.id).asdict()
        scenary_review['url'] = scenary_place.image_urls
        scenary_review['name'] = scenary_place.name
        scenary_review['tag'] = [feature.feature_name for feature in scenary_place.features.all()]
        detail = [activity_review, dinner_review, scenary_review]
        return JsonResponse({'reviewDetail': detail}, status=200)

    req_data = json.loads(request.body.decode())
    modify_review = Review.objects.get(id=ids)
    if modify_review.user != request.user:
        return HttpResponse(status=403)
    modify_review.score = req_data.get('score', None)
    modify_review.content = req_data.get('content', None)
    modify_review.save()
    return JsonResponse(modify_review.asdict(), status = 201)

@require_http_methods(['GET'])
@ensure_csrf_cookie
def token(request):
    return HttpResponse(status=204)
