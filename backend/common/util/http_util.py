import os

import requests

from asapgo.settings.base import LAMBDA_FUNCTION_URL


class HttpStatusCode:  # pylint: disable=too-few-public-methods
    Created = 201
    NoContent = 204
    Forbidden = 400
    UnAuthorized = 401


REACT_APP_API_KEY = os.getenv('REACT_APP_API_KEY')


def suggestion_algorithm(candidates):
    try:
        res = requests.post(url=LAMBDA_FUNCTION_URL, json=candidates)
        if res.status_code != 200:
            return None
        return res.json()
    except Exception:
        return None


def time_distance(lat, long, places, mode=0):
    url_base = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins='
    distance = []
    time = []
    url_origin = str(lat) + ',' + str(long)
    url_des = ''
    for index, place in enumerate(places):
        if index < len(places) - 1:
            url_origin = url_origin + '|' + str(place['lat']) + ',' + str(place['lng'])
        url_des = url_des + str(place['lat']) + ',' + str(place['lng'])
        if index != len(places) - 1:
            url_des = url_des + '|'
    url_base = url_base + url_origin + '&destinations=' + url_des + '&region=KR&language=ko&key=' + REACT_APP_API_KEY
    response = requests.get(url_base).json()
    rows = response.get('rows', None)
    for index, row in enumerate(rows):
        element = row.get('elements', None)
        if index == 0 and mode == 0:
            distance.append(element[2].get('distance', None))
            time.append(element[2].get('duration', None))
        distance.append(element[index].get('distance', None))
        time.append(element[index].get('duration', None))
    return distance, time
