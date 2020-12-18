import json
import datetime
import os
from unittest.mock import patch

import responses
from django.test import TestCase
from django.utils import timezone
from common.util.test_utils import APITestCase, NotAllowedTestCase
from account.models import User, PersonalityType, Personality
from plan.models import Plan, HalfDayOffReservation, TransportationReservation, \
    Taxi, PlaceReservation, Place, Review, Features, Preference
from plan.service import place_recommend

os.environ.setdefault('REACT_APP_API_KEY', 'key')

stub_taxi = {
    'phone_number': '010-5882-5467',
    'company': '개인 택시',
    'car_number': '서23울 3175',
    'reservable': True
}

stub_user = {
    'email': 'stub@naver.com',
    'nickname': "stub nickname",
    'password': 'stub password',
    'phone_number': '010-1234-1234',
}

stub_user2 = {
    'email': 'stub2@naver.com',
    'nickname': "stub2 nickname",
    'password': 'stub2 password',
    'phone_number': '010-1234-1234',
}


def setup_plan_database():
    now = timezone.make_aware(datetime.datetime.now())
    taxi = Taxi(**stub_taxi)
    taxi.save()
    taxi_reservation = TransportationReservation.objects.create(taxi=taxi, reservation_name='nickname',
                                                                reservation_time=now, status=2, tot_price=50000,
                                                                head_count=2)
    user = User.objects.first()
    plan = Plan.objects.create(user=user, head_count=2, created_at=now,
                               started_at=now, ended_at=now, total_distance=1000)
    feature = Features.objects.create(feature_name='feature1', status=1)
    place = Place.objects.create(latitude=37.4772964, longitude=126.958394, type='음식',
                                 name='food', image_key='test1.jpb', status=1, avg_score=-1)
    place.features.add(feature)
    Place.objects.create(latitude=37.47964, longitude=126.9594, type='음식',
                         name='food', image_key='test2.jpb', status=1, avg_score=-1)
    place_reservation = PlaceReservation.objects.create(place=place,
                                                        reservation_name='food', status=1, head_count=1,
                                                        tot_price=10000)
    HalfDayOffReservation.objects.create(plan=plan, activity=place_reservation, dinner=place_reservation,
                                         scenary=place_reservation, transportation=taxi_reservation)


def setup_review_database():
    user = User.objects.first()
    User.objects.create_user(**stub_user2)
    feature = Features.objects.create(feature_name='feature', status=1)
    place = Place.objects.create(latitude=37.4772964, longitude=126.958394, type='음식',
                                 name='food', image_key='test1.jpb',
                                 status=1, avg_score=-1)
    place2 = Place.objects.create(latitude=37.47964, longitude=126.9594, type='음식',
                                  name='food', image_key='test2.jpb',
                                  status=1, avg_score=-1)
    place3 = Place.objects.create(latitude=37.47729, longitude=126.939, type='음식',
                                  name='food', image_key='test3.jpb',
                                  status=1, avg_score=-1)
    place.features.add(feature)
    place_reservation = PlaceReservation.objects.create(place=place,
                                                        reservation_name='food', status=1, head_count=1,
                                                        tot_price=10000)
    taxi = Taxi.objects.create(company='hi', car_number='02rk 0125', phone_number='+821043243211')
    transportation = TransportationReservation(taxi=taxi, reservation_name='stub user', status=1,
                                               head_count=1, tot_price=10000)
    transportation.save()
    plan = Plan.objects.create(user=user, head_count=1, feedback=-1,
                               started_at=timezone.make_aware(datetime.datetime(2020, 11, 6, 10, 5, 1)),
                               ended_at=timezone.make_aware(datetime.datetime(2020, 11, 6, 17, 5, 1)))
    HalfDayOffReservation.objects.create(transportation=transportation, activity=place_reservation,
                                         dinner=place_reservation, scenary=place_reservation)
    Review.objects.create(user=user, place=place, plan=plan, score=4, content='hi')
    Review.objects.create(user=user, place=place2, plan=plan, score=3, content='hi2')
    Review.objects.create(user=user, place=place3, plan=plan, score=5, content='hi3')


class PlanNotAllowedTestCase(NotAllowedTestCase):
    URL_PREFIX = '/api/plan/'

    NOT_SUPPORTED_METHOD_CASE = [
        {'url': '', 'method': 'get'},
        {'url': '', 'method': 'put'},
        {'url': '', 'method': 'delete'},
        {'url': 'history/', 'method': 'put'},
        {'url': 'history/', 'method': 'post'},
        {'url': 'history/', 'method': 'delete'},
        {'url': 'review/', 'method': 'put'},
        {'url': 'review/', 'method': 'delete'},
        {'url': 'review/1/', 'method': 'post'},
        {'url': 'review/1/', 'method': 'delete'},
    ]

    NOT_AUTHORIZED_CHECK_CASE = [
        {'url': '', 'method': 'post'},
        {'url': 'history/', 'method': 'get'},
        {'url': 'review/', 'method': 'get'},
        {'url': 'review/', 'method': 'post'},
        {'url': 'review/1/', 'method': 'get'},
        {'url': 'review/1/', 'method': 'put'},
    ]


class PlanTest(APITestCase):
    url = '/api/plan/'

    def _setup_database(self):
        Taxi(**stub_taxi).save()
        setup_plan_database()

    @patch('plan.views.time_distance')
    @patch('plan.views.suggestion_algorithm')
    def test_post_with_valid_request(self, suggestion_algorithm, time_distance):
        Plan.objects.all().delete()
        time_distance.return_value = ([{'value': 1}], [{'value': 1}])

        suggestion_algorithm.return_value = {
            'result': [
                "{\"distance\": 14, \"travel_period\": 1.66268, \"satisfaction\": 49.8805, "
                "\"activity\": {\"id\": 1, \"lng\": 39, \"lat\": 127}, \"dinner\": {\"id\": 1, "
                "\"lng\": 39.04, \"lat\": 127.04}, \"scenery\": {\"id\": 1, \"lng\": 39.09, "
                "\"lat\": 127.09}}"
            ]
        }
        data = {
            'level': 1,
            'headCount': 2,
            'lat': 1,
            'long': 1,
        }
        response = self.client.post(self.url, json.dumps(data),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)

    @patch('plan.views.suggestion_algorithm')
    def test_post_with_not_valid_plan_request(self, suggestion_algorithm):
        Plan.objects.all().delete()
        suggestion_algorithm.return_value = None
        data = {
            'level': 1,
            'headCount': 2,
            'lat': 1,
            'long': 1,
        }
        response = self.client.post(self.url, json.dumps(data),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)

    def test_post_with_already_exist_plan(self):
        data = {
            'level': 1,
            'headCount': 2,
        }
        response = self.client.post(self.url, json.dumps(data),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)


class RervationTest(APITestCase):
    url = '/api/plan/reservation/'

    def _setup_database(self):
        setup_plan_database()

    @responses.activate
    def test_post_with_valid_request(self):
        responses.add(responses.GET, 'https://maps.googleapis.com/maps/api/distancematrix/json',
                      body='{ "rows": [{ "elements": [{"distance": { "value": 1 }, '
                           '"duration": { "value" : 1 } }] }, { "elements": [{"distance": { "value": 1 }, '
                           '"duration": { "value" : 1 } }, {"distance": { ' \
                           '"value": 1 }, "duration": { "value" : 1 } }] }] }', status=200,
                      content_type='application/json')
        data = {'lat': 1, 'lng': 1, }
        response = self.client.post(self.url, json.dumps(data), content_type='application/json',
                                    HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)


class HistoryTest(APITestCase):
    url = '/api/plan/history/'
    user_for_login = stub_user

    def _setup_database(self):
        setup_review_database()

    def test_history_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)


class ReviewTest(APITestCase):
    url = '/api/plan/review/'
    user_for_login = stub_user

    def _setup_database(self):
        setup_review_database()

    def test_review_get(self):
        response = self.client.get('/api/plan/review/', content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_review_post(self):
        data = {
            'review': [
                {'place': 1, 'plan': 1, 'score': 3, 'content': 'hi'},
                {'place': 2, 'plan': 1, 'score': 4, 'content': 'hi2'},
                {'place': 3, 'plan': 1, 'score': 2, 'content': 'hi3'}
            ]
        }
        response = self.client.post('/api/plan/review/', json.dumps(data),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.all().count(), 6)


class ReviewDetailTest(APITestCase):
    url = '/api/plan/review/1/'
    user_for_login = stub_user

    def _setup_database(self):
        setup_review_database()

    def test_review_detail_get(self):
        response = self.client.get(self.url, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_review_detail_put(self):
        data = {'id': 1, 'score': 3, 'content': 'bye'}
        response = self.client.put(self.url, json.dumps(data),
                                   content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.get(id=1).content, 'bye')

    def test_review_detail_put_other_user(self):
        self.client.login(username=stub_user2['email'], password=stub_user2['password'])
        data = {'id': 1, 'score': 3, 'content': 'bye'}
        response = self.client.put(self.url, json.dumps(data),
                                   content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Review.objects.get(id=1).content, 'hi')


class TaxiModelTest(TestCase):
    def test_get_taxi_with_valid_taxi(self):
        Taxi(**stub_taxi).save()
        taxi = Taxi.get_reservable_taxi()
        self.assertEqual(taxi.phone_number, stub_taxi['phone_number'])
        self.assertEqual(taxi.car_number, stub_taxi['car_number'])
        self.assertEqual(taxi.reservable, stub_taxi['reservable'])
        self.assertTrue(taxi.company, stub_taxi['company'])

    def test_create_super_user_with_valid_case(self):
        taxi = Taxi.get_reservable_taxi()
        self.assertIsNotNone(taxi)


class PlaceRecommendFunctionTest(TestCase):
    def setUp(self):
        user = User.objects.create_user(**stub_user)
        for name in ['조용한', '신나는', '매니악한']:
            Features.objects.create(feature_name=name, status=0)
        features = Features.objects.all()
        for personality_type in ['O', 'N']:
            PersonalityType.objects.create(classification_type='test_check', personality_type=personality_type)
        personality_types = PersonalityType.objects.all()
        for i, personality_type in enumerate(personality_types):
            Personality.objects.create(user=user, score=i, type=personality_type)

        for i, personality_type in enumerate(personality_types):
            for j, feature in enumerate(features):
                Preference.objects.create(personality=personality_type, feature=feature, weight=i + 0.1 * j)

        for i, place_type in enumerate(['food', 'scenery', 'activity']):
            for j in range(3):
                place = Place.objects.create(latitude=36.4772964 + i, longitude=125.958394 + j, type=place_type,
                                             name=f'{place_type}{j}', image_key='', status=1, avg_score=-1)
                for feature in features:
                    place.features.add(feature)
                place.save()

    def test_valid_case(self):
        user_id = User.objects.first().id
        result = place_recommend(user_id, 37.47964, 126.9594, 1.2)
        self.assertEqual(len(result.get('dinner', [])), 1)
        self.assertEqual(len(result.get('scenery', [])), 3)
        self.assertEqual(len(result.get('activity', [])), 1)

    def test_no_valid_place(self):
        user_id = User.objects.first().id
        result = place_recommend(user_id, 1000, 10000, 1.2)
        self.assertEqual(len(result.get('dinner', [])), 0)
        self.assertEqual(len(result.get('scenery', [])), 0)
        self.assertEqual(len(result.get('activity', [])), 0)
