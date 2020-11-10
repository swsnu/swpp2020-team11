from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from common.util.auth_util import login_required


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan(request):
    result = {
        'imageUrls': [
            'http://www.puzzlesarang.com/shop/data/goods/1569406172621m0.jpg',
            'https://img.huffingtonpost.com/asset/5bf24ac824000060045835ff.jpeg?ops=scalefit_720_noupscale&format=webp',
            'https://pbs.twimg.com/media/Dxai_-gUYAEktpi?format=jpg&name=medium',
        ],
        'hashTags': [
            "조용한",
            "고급스러운",
            "경치가 아름다운"
        ],
        'information': {
            'headCount': 2,
            'startTime': '1/23 18:30',
            'endTime': '1/23 23:30',
            'expectedBudget': '300000',
            'travelDistance': '150000',
        }
    }
    return JsonResponse(data=result)


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def reservation(request):
    result = {
        'imageUrls': [
            'http://www.puzzlesarang.com/shop/data/goods/1569406172621m0.jpg',
            'https://img.huffingtonpost.com/asset/5bf24ac824000060045835ff.jpeg?ops=scalefit_720_noupscale&format=webp',
            'https://pbs.twimg.com/media/Dxai_-gUYAEktpi?format=jpg&name=medium',
        ],
        'hashTags': [
            "조용한",
            "고급스러운",
            "경치가 아름다운"
        ],
        'information': {
            'headCount': 2,
            'startTime': '1/23 18:30',
            'endTime': '1/23 23:30',
            'expectedBudget': '300000',
            'travelDistance': '150000',
        }
    }
    return JsonResponse(data=result)
