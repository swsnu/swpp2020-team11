from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode
import time


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan(request):
    return HttpResponse(status=HttpStatusCode.NoContent)


@ensure_csrf_cookie
@require_http_methods(['GET'])
@login_required
def planReservation(request):
    if request.method == 'GET' :
        taxi_color = 'orange'
        phone_number = '010-5882-5467'
        car_number = '서23울 3175'
        estimated_arrival_time = None
        current_location = None
        now = time.strftime('%H%M%S') # Current time 22H 31M 17S -> now = 223117
        now = int(now) + 500
        if (now % 10000 / 100) > 60 :
            now = now + 4000
            if now > 240000 :
                now = now - 240000
        estimated_arrival_location = str(now)
        
        return JsonResponse({"taxi_color" : taxi_color, "phone_number" : phone_number, \
            "car_number" : car_number, "estimated_arrival_time" : estimated_arrival_time, \
                "current_location" : current_location, \
                    "estimated_arrival_location" : estimated_arrival_location}, status = 200)
