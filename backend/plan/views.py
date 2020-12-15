import json
import random
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.utils import timezone

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from account.models import User
from .models import Plan, HalfDayOffReservation, Review, Place, Taxi, TransportationReservation, PlaceReservation


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def suggested_plan(request):
    plan = Plan.get_today_plan(request.user)
    if plan is None:
        req = json.loads(request.body.decode())
        head_count = req.get('headCount', 1)
        taxi = Taxi.get_reservable_taxi()
        taxi_reservation = TransportationReservation(taxi=taxi, reservation_name=request.user.nickname,
                                                     reservation_time=timezone.now(), status=2, tot_price=50000,
                                                     head_count=head_count)
        taxi_reservation.save()
        plan = Plan(user=request.user, head_count=head_count, created_at=timezone.now(),
                    started_at=timezone.now(), ended_at=timezone.now())
        plan.save()
        while True:
            activity_id = random.randint(0,Place.objects.all().count())
            scene_id = random.randint(0,Place.objects.all().count())
            activity = Place.objects.all()[activity_id]
            scene = Place.objects.all()[scene_id]
            if activity_id != scene_id: #and activity.type != '음식점' and scene.type != '음식점':
                break
        dinner = Place.objects.filter(type='음식점')
        dinner_id = random.randint(0, dinner.count())
        dinner = dinner[dinner_id]
        activity_re = PlaceReservation(place=activity, reservation_name=request.user.nickname, status=1, head_count=1, tot_price=10000)
        activity_re.save()
        dinner_re = PlaceReservation(place=dinner, reservation_name=request.user.nickname, status=1, head_count=1, tot_price=10000)
        dinner_re.save()
        scene_re = PlaceReservation(place=scene, reservation_name=request.user.nickname, status=1, head_count=1, tot_price=10000)
        scene_re.save()
        reservation = HalfDayOffReservation(plan=plan, transportation=taxi_reservation, activity=activity_re, dinner=dinner_re, scenary=scene_re)
        reservation.save()
    start_date = plan.started_at + timezone.timedelta(hours=9)
    start_date = start_date.strftime("%m/%d %H:%M")
    end_date = plan.ended_at + timezone.timedelta(hours=13)
    end_date = end_date.strftime("%m/%d %H:%M")
    halfdayoff = HalfDayOffReservation.objects.get(plan_id=plan.id)
    result = {
        'imageUrls': [
            halfdayoff.activity.place.image_urls,
            halfdayoff.dinner.place.image_urls,
            halfdayoff.scenary.place.image_urls
        ],
        'hashTags': [
            "활기찬",
            "분위기 좋은",
            "경치가 아름다운"
        ],
        'information': {
            'headCount': 1,
            'startTime': start_date,
            'endTime': end_date,
            'expectedBudget': '300000',
            'travelDistance': '150000',
        }
    }
    return JsonResponse(data=result)


@require_http_methods(['GET'])
@login_required
def history(request):
    plans = Plan.objects.order_by('started_at').filter(user_id=request.user.id)
    print(plans)
    halfdayoff = HalfDayOffReservation.objects.filter(plan_id__in=[plan.id for plan in plans])
    places = []
    for index, half in enumerate(halfdayoff):
        place = []
        dayoff = half
        act = dayoff.activity.place
        print(act.features)
        place.append({"id": act.id, "lat": act.latitude, "lng": act.longitude, "name": act.name,
                      "img_urls": act.image_key, "tag": [feature.feature_name for feature in act.features.all()]})
        din = dayoff.dinner.place
        place.append({"id": din.id, "lat": din.latitude, "lng": din.longitude, "name": din.name,
                      "img_urls": din.image_key, "tag": [feature.feature_name for feature in din.features.all()]})
        sce = dayoff.scenary.place
        place.append({"id": sce.id, "lat": sce.latitude, "lng": sce.longitude, "name": sce.name,
                      "img_urls": sce.image_key, "tag": [feature.feature_name for feature in sce.features.all()]})
        date = plans[index].started_at + timezone.timedelta(hours=9)
        places.append({"id": half.plan_id, "place": place, "date": date.strftime("%Y-%m-%d")})
    return JsonResponse({"history": places})


@require_http_methods(['GET', 'POST'])
@login_required
def review(request):
    if request.method == 'GET':
        reviews = Review.objects.filter(user_id=request.user.id)
        review_all = [review.asdict() for review in reviews]
        return JsonResponse({'review': review_all})

    req_data = json.loads(request.body.decode())
    reviews = req_data.get('review', None)
    user = User.objects.get(id=request.user.id)
    places = Place.objects.filter(id__in=[review.get('place') for review in reviews])
    plan_review = Plan.objects.get(id=reviews[0].get('plan'))
    new_review = []
    for i in reviews:
        place = places.get(id=i.get('place'))
        review_save = Review(user=user, place=place, plan=plan_review,
                             score=i.get('score'), content=i.get('content'))
        review_save.save()
        new_review.append(review_save.asdict())
    return JsonResponse({'review': new_review}, status=HttpStatusCode.Created)


@require_http_methods(['GET', 'PUT'])
@login_required
def review_detail(request, ids):
    if request.method == 'GET':
        reviews = Review.objects.get(id=ids)
        plans = HalfDayOffReservation.objects.get(plan_id=reviews.plan_id)
        user_id = request.user.id
        activity_place = plans.activity.place
        activity_review = Review.objects.get(user_id=user_id, place_id=activity_place.id).asdict()
        activity_review['url'] = activity_place.image_key
        activity_review['name'] = activity_place.name
        activity_review['tag'] = [feature.feature_name for feature in activity_place.features.all()]
        dinner_place = plans.dinner.place
        dinner_review = Review.objects.get(user_id=user_id, place_id=dinner_place.id).asdict()
        dinner_review['url'] = dinner_place.image_key
        dinner_review['name'] = dinner_place.name
        dinner_review['tag'] = [feature.feature_name for feature in dinner_place.features.all()]
        scenary_place = plans.scenary.place
        scenary_review = Review.objects.get(user_id=user_id, place_id=scenary_place.id).asdict()
        scenary_review['url'] = scenary_place.image_key
        scenary_review['name'] = scenary_place.name
        scenary_review['tag'] = [feature.feature_name for feature in scenary_place.features.all()]
        detail = [activity_review, dinner_review, scenary_review]
        return JsonResponse({'reviewDetail': detail})

    req_data = json.loads(request.body.decode())
    modify_review = Review.objects.get(id=ids)
    if modify_review.user != request.user:
        return HttpResponse(status=403)
    modify_review.score = req_data.get('score', None)
    modify_review.content = req_data.get('content', None)
    modify_review.save()
    return JsonResponse(modify_review.asdict(), status=HttpStatusCode.Created)


@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan_reservation(request):
    # it should be 꺼내오기 from database
    plan = Plan.get_today_plan(request.user)
    trans_reservation = plan.reservation.transportation
    taxi = trans_reservation.taxi
    taxi_image = 'https://thewiki.ewr1.vultrobjects.com/data/' \
                 'ec8f98eb8298ed838020eb89b4eb9dbcec9db4eca68820ed839dec8b9c2e706e67.png'
    # we should create calculate algorithm
    # we should decide how we can get current location of taxi
    current_location = {
        "lat": 37.5291281,
        "lng": 127.0691572,
    }
    arrival_location = {
        "lat": 38.5291281,
        "lng": 128.0691572,
    }

    taxi_information = {
        "taxiImage": taxi_image,
        "taxiType": taxi.company, "phoneNumber": f'{taxi.phone_number}',
        "carNumber": taxi.car_number, "arrivalTime": plan.ended_at,
        "currentLocation": current_location, "arrivalLocation": arrival_location}

    return JsonResponse({"taxi": taxi_information})
