from collections import defaultdict

from django.db.models import F, Prefetch
from account.models import Personality
from .models import Preference, Features, Place

ACTIVITY_TYPE = ['체험관광지', '스포츠', '육상 레포츠', '항공 레포츠', '복합 레포츠', '공예,공방', 'activity']
RESTAURANT_TYPE = ['음식점', 'food']
SCENERY_TYPE = ['휴양관광지', '역사관광지', '건축/조형물', '자연관광지', '산업관광지', '바/카페', 'scenery']


def place_recommend(user_id, latitude, longitude, radius):
    place_list = Place.objects.annotate(
        distance=(F('latitude') - latitude) ** 2 + (F('longitude') - longitude) ** 2
    ).filter(
        distance__lt=radius
    ).prefetch_related(
        Prefetch(
            'features',
            queryset=Features.objects.prefetch_related(
                Prefetch(
                    'preference_feature',
                    queryset=Preference.objects
                        .select_related('personality')
                        .prefetch_related(
                            Prefetch(
                                'personality__personalities',
                                queryset=Personality.objects.filter(user_id=user_id).select_related('user'),
                                to_attr='user_personality'
                            )
                    ),
                    to_attr='preference'
                )
            ),
            to_attr='feature_list'
        )
    ).all()

    candidates = defaultdict(list)
    for place in place_list:
        score = 0
        for feature in place.feature_list:
            for preference in feature.preference:
                score += preference.weight * preference.personality.user_personality[0].score
        place_item = {
            "id": place.id,
            "preference": score,
            "lat": place.latitude,
            "lng": place.longitude
        }
        if place.type in ACTIVITY_TYPE:
            candidates['activity'].append(place_item)
        elif place.type in RESTAURANT_TYPE:
            candidates['dinner'].append(place_item)
        if place.type in SCENERY_TYPE:
            candidates['scenery'].append(place_item)

    candidates = {k: sorted(v, key=lambda x: x["preference"], reverse=True) for k, v in candidates.items()}
    return candidates
