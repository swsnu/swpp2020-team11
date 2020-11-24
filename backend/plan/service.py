from django.db.models import F
from account.models import PersonalityType
from .models import Preference, Review, Features, Place

def place_recommend(userID, latitude, longitude):
    feature_list = [feature.feature_name for feature in Features.objects.all()]

    place_list = Place.objects.annotate(
        distance=( F('latitude') - latitude ) ** 2 + ( F('longitude') - longitude ) ** 2
    ).filter(
        distance__lt=2
    ).prefetch_related(
        'features__preference_feature__personality__user'
    )

    place_dict = {}
    for place in place_list:
        score = 0
        for feature_name in feature_list:
            try:
                feature = place.features.get(feature_name=feature_name)
            except Features.DoesNotExist:
                continue
            preference_list = feature.preference_feature.filter(personality__user__id=userID)
            for preference in preference_list:
                score += preference.weight * preference.personality.score
        place_dict[place.name] = score
    
    result = sorted(place_dict.items(), key=(lambda x: x[1]), reverse=True)
    return result
