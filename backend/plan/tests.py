import json
import datetime

from django.test import TestCase
from django.utils import timezone
from common.util.test_utils import APITestCase, NotAllowedTestCase
from account.models import User
from plan.models import Plan, HalfDayOffReservation, TransportationReservation, \
    Taxi, PlaceReservation, Place, Review, Features

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
    taxi_reservation = TransportationReservation(taxi=taxi, reservation_name='nickname',
                                                 reservation_time=now, status=2, tot_price=50000,
                                                 head_count=2)
    taxi_reservation.save()
    user = User.objects.first()
    plan = Plan(user=user, head_count=2, created_at=now,
                started_at=now, ended_at=now)
    plan.save()
    reservation = HalfDayOffReservation(plan=plan, transportation=taxi_reservation)
    reservation.save()


def setup_review_database():
    user = User.objects.first()
    User.objects.create_user(**stub_user2)
    feature = Features.objects.create(feature_name='feature', status=1)
    place = Place.objects.create(latitude=37.4772964, longitude=126.958394, type='음식',
                                 name='food', image_urls='https://search.pstatic.net/common/?' \
                                                         'autoRotate=true&quality=95&size=168x130&' \
                                                         'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289' \
                                                         '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
                                 status=1, avg_score=-1)
    place2 = Place.objects.create(latitude=37.47964, longitude=126.9594, type='음식',
                                  name='food', image_urls='https://search.pstatic.net/common/?' \
                                                          'autoRotate=true&quality=95&size=168x130&' \
                                                          'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289' \
                                                          '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
                                  status=1, avg_score=-1)
    place3 = Place.objects.create(latitude=37.47729, longitude=126.939, type='음식',
                                  name='food', image_urls='https://search.pstatic.net/common/?' \
                                                          'autoRotate=true&quality=95&size=168x130&' \
                                                          'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289' \
                                                          '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
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

    def test_post_with_valid_request(self):
        data = {
            'level': 1,
            'headCount': 2,
        }
        response = self.client.post(self.url, json.dumps(data),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)

    def test_post_with_already_exist_plan(self):
        setup_plan_database()
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

    def test_post_with_valid_request(self):
        response = self.client.post(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
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
