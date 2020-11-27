from collections import defaultdict

from django.db.models import F, Prefetch
from account.models import Personality
from .models import Preference, Features, Place


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
        candidates[place.type].append((place, score))

    candidates = {k: sorted(v, key=lambda x: x[1], reverse=True) for k, v in candidates.items()}
    return candidates
