from django.http import HttpResponse, JsonResponse

from common.util.auth_util import login_required
from common.util.http_util import HttpStatusCode

from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods


# dummy plan function for test
@ensure_csrf_cookie
@require_http_methods(['POST'])
@login_required
def plan(request):
    return HttpResponse(status=HttpStatusCode.NoContent)
