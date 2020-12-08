import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods

from asapgo.settings.base import S3_IMAGE_STORAGE
from common.util.auth_util import login_required
from common.util.image_util import get_image_extension

from suggest.models import Suggestion
from plan.models import Place, HashTag
from common.util.aws_util import create_presigned_post
from common.util.http_util import HttpStatusCode
import uuid


# Create your views here.
@require_http_methods(['GET', 'POST'])
@login_required
def suggest_list(request):
    if request.method == 'GET':
        suggestions = Suggestion.objects.order_by('-updated_at'). \
            filter(user_id=request.user.id). \
            select_related('place'). \
            prefetch_related('hashtag').all()

        result = []
        for suggestion in suggestions:
            result.append({
                'id': suggestion.id,
                'place': {
                    'name': suggestion.place.name,
                    'lat': suggestion.place.latitude,
                    'lng': suggestion.place.longitude,
                    'score': suggestion.place.avg_score
                },
                'updated_at': suggestion.updated_at,
                'status': suggestion.status,
                'hashTags': [tag.hashtag_name for tag in suggestion.hashtag.all()]
            })
        return JsonResponse({'suggestList': result}, safe=False)
    else:
        req = json.loads(request.body.decode())
        place = Place.objects.create(latitude=req['location']['lat'], longitude=req['location']['lng'],
                                     roadAddress=req['roadAddress'], extraAddress=req['extraAddress'],
                                     type='not_verified', name=req['name'], image_key=req['hashedImageKey'], status=1,
                                     avg_score=0)
        tag_names = [tag.strip() for tag in req['tags'].split(',') if tag]
        name_to_tag = {tag.hashtag_name: tag for tag in HashTag.objects.filter(hashtag_name__in=tag_names).all()}
        tags = []
        for tag_name in tag_names:
            tag = name_to_tag.get(tag_name, None)
            if tag is None:
                tag = HashTag.objects.create(hashtag_name=tag_name)
            else:
                tag.count += 1
            tags.append(tag)
        suggestion = Suggestion.objects.create(user=request.user, place=place, content=req['explanation'], status=1)
        suggestion.hashtag.add(*tags)
        return HttpResponse()


@require_http_methods(['GET', 'PUT'])
@login_required
def suggest(request, suggest_id):
    if request.method == 'GET':
        suggestion = Suggestion.objects.filter(id=suggest_id) \
            .select_related('place') \
            .prefetch_related('hashtag').first()
        suggestion_dict = {
            'id': suggestion.id,
            'location': {
                'lat': suggestion.place.latitude,
                'lng': suggestion.place.longitude,
            },
            'hashedImageKey': suggestion.place.image_key,
            'name': suggestion.place.name,
            'explanation': suggestion.content,
            'roadAddress': suggestion.place.roadAddress,
            'extraAddress': suggestion.place.extraAddress,
            'tags': ', '.join([tag.hashtag_name for tag in suggestion.hashtag.all()])
        }

        return JsonResponse({'suggest': suggestion_dict})
    else:
        req = json.loads(request.body.decode())
        suggestion = Suggestion.objects.filter(id=suggest_id) \
            .select_related('place') \
            .prefetch_related('hashtag').first()
        suggestion.place.latitude = req['location']['lat']
        suggestion.place.longitude = req['location']['lng']
        suggestion.place.roadAddress = req['roadAddress']
        suggestion.place.extraAddress = req['extraAddress']
        suggestion.place.name = req['name']
        suggestion.place.image_key = req['hashedImageKey']
        suggestion.place.save()

        suggestion.content = req['explanation']

        tag_names = [tag.strip() for tag in req['tags'].split(',') if tag]
        name_to_tag = {tag.hashtag_name: tag for tag in suggestion.hashtag.all()}

        tags = list()

        for tag_name in tag_names:
            if tag_name in name_to_tag:
                tags.append(name_to_tag.pop(tag_name))
            else:
                tag, _ = HashTag.objects.get_or_create(hashtag_name=tag_name)
                tags.append(tag)
        suggestion.hashtag.set(tags)
        suggestion.save()
        return HttpResponse()


@require_http_methods(['POST'])
@login_required
def image_upload_presigned_url(request):
    image_uuid = uuid.uuid4()
    req = json.loads(request.body.decode())
    filename = req.get('filename', '')
    image_name = image_uuid.hex + '.' + get_image_extension(filename)
    res = create_presigned_post(S3_IMAGE_STORAGE, image_name)
    if res is None:
        return HttpResponse(status=HttpStatusCode.Forbidden)
    return JsonResponse(res)
