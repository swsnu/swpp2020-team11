import json
from datetime import datetime
from django.utils import timezone
from django.test import Client
from common.util.test_utils import APITestCase, NotAllowedTestCase
from account.models import User
from plan.models import Plan, HalfDayOff, TransportationReservation, Taxi, PlaceReservation, Place, Review, Features

class PlanNotAllowedTestCase(NotAllowedTestCase):
    URL_PREFIX = '/api/plan/'

    NOT_SUPPORTED_METHOD_CASE = [
        {'url': '', 'method': 'get'},
        {'url': '', 'method': 'put'},
        {'url': '', 'method': 'delete'},
    ]

    NOT_AUTHORIZED_CHECK_CASE = [
        {'url': '', 'method': 'post'},
    ]


class SignOutTest(APITestCase):
    url = '/api/plan/'

    def test_post_with_valid_request(self):
        response = self.client.post(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)

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
def setup_database():
    user = User.objects.create_user(**stub_user)
    User.objects.create_user(**stub_user2)
    feature = Features.objects.create(feature_name='feature', status=1)
    place = Place.objects.create(latitude=37.4772964, longitude=126.958394, type='음식',
                                name='food', image_urls='https://search.pstatic.net/common/?'\
                                'autoRotate=true&quality=95&size=168x130&'\
                                'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289'\
                                '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
                                status=1, avg_score=-1)
    place2 = Place.objects.create(latitude=37.47964, longitude=126.9594, type='음식',
                                name='food', image_urls='https://search.pstatic.net/common/?'\
                                'autoRotate=true&quality=95&size=168x130&'\
                                'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289'\
                                '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
                                status=1, avg_score=-1)
    place3 = Place.objects.create(latitude=37.47729, longitude=126.939, type='음식',
                                name='food', image_urls='https://search.pstatic.net/common/?'\
                                'autoRotate=true&quality=95&size=168x130&'\
                                'src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20151104_289'\
                                '%2F1446623193931bk3Lq_JPEG%2F167054567652065_1.jpg&type=f',
                                status=1, avg_score=-1)
    place.features.add(feature)
    place_reservation = PlaceReservation.objects.create(place=place,
                        reservation_name='food', status=1, head_count=1, tot_price=10000)
    taxi = Taxi.objects.create(company='hi', car_number='02rk 0125', phone_number='+821043243211')
    transportation = TransportationReservation(taxi=taxi, reservation_name='stub user', status=1,
                        head_count=1, tot_price=10000)
    transportation.save()
    plan = Plan.objects.create(user=user, head_count=1, started_at=timezone.make_aware(datetime(2020, 11, 6, 10, 5, 1)),
                                ended_at=timezone.make_aware(datetime(2020, 11, 6, 17, 5, 1)), feedback=-1)
    HalfDayOff.objects.create(transportation=transportation, activity=place_reservation,
                                            dinner=place_reservation, scenary=place_reservation)
    Review.objects.create(user=user, place=place, plan=plan, score=4, content='hi')
    Review.objects.create(user=user, place=place2, plan=plan, score=3, content='hi2')
    Review.objects.create(user=user, place=place3, plan=plan, score=5, content='hi3')


class HistoryTest(APITestCase):
    url = '/api/plan/history/'
    login_url = '/api/user/login/'
    CSRF_CHECK_URL = '/api/plan/token/'
    def login1(self):
        self.client.post(self.login_url, {'email': 'stub@naver.com', 'password': 'stub password'},
                            content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
    def get_csrf(self):
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.get_csrf()
        setup_database()
    def test_history_get_without_login(self):
        response = self.client.get('/api/plan/history/',content_type='application/json')
        self.assertEqual(response.status_code, 401)
    def test_history_get(self):
        self.login1()
        response = self.client.get('/api/plan/history/',content_type='application/json')
        self.assertEqual(response.status_code, 200)
    def test_history_invalid_request(self):
        self.login1()
        self.get_csrf()
        response = self.client.put('/api/plan/history/',content_type='application/json',HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 405)

class ReviewTest(APITestCase):
    url = '/api/plan/review/'
    login_url = '/api/user/login/'
    CSRF_CHECK_URL = '/api/plan/token/'
    def login1(self):
        self.client.post(self.login_url, {'email': 'stub@naver.com', 'password': 'stub password'},
                            content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
    def get_csrf(self):
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.get_csrf()
        setup_database()
    def test_review_get_without_login(self):
        response = self.client.get('/api/plan/review/',content_type='application/json')
        self.assertEqual(response.status_code, 401)
    def test_review_get(self):
        self.login1()
        response = self.client.get('/api/plan/review/',content_type='application/json')
        self.assertEqual(response.status_code, 200)
    def test_review_post(self):
        data=[{ 'place': 1, 'plan': 1, 'score': 3, 'content': 'hi' }]
        data.append({ 'place': 2, 'plan': 1, 'score': 4, 'content': 'hi2' })
        data.append({ 'place': 3, 'plan': 1, 'score': 2, 'content': 'hi3' })
        data = {'review':data}
        self.login1()
        self.get_csrf()
        response = self.client.post('/api/plan/review/', json.dumps(data),
                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.all().count(), 6)
    def test_review_invalid_request(self):
        self.login1()
        self.get_csrf()
        response = self.client.put('/api/plan/history/',content_type='application/json',
                                    HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 405)

class ReviewDetailTest(APITestCase):
    url = '/api/plan/review/'
    login_url = '/api/user/login/'
    CSRF_CHECK_URL = '/api/plan/token/'
    def login1(self):
        self.client.post(self.login_url, {'email': 'stub@naver.com', 'password': 'stub password'},
                            content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
    def login2(self):
        self.client.post(self.login_url, {'email': 'stub2@naver.com', 'password': 'stub2 password'},
                            content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
    def get_csrf(self):
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.get_csrf()
        setup_database()
    def test_review_detail_get_without_login(self):
        response = self.client.get('/api/plan/review/1/',content_type='application/json')
        self.assertEqual(response.status_code, 401)
    def test_review_detail_get(self):
        self.login1()
        response = self.client.get('/api/plan/review/1/',content_type='application/json')
        self.assertEqual(response.status_code, 200)
    def test_review_detail_put(self):
        self.login1()
        self.get_csrf()
        data ={ 'id': 1, 'score': 3, 'content': 'bye' }
        response = self.client.put('/api/plan/review/1/', json.dumps(data),
                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Review.objects.get(id=1).content, 'bye')
    def test_review_detail_put_other_user(self):
        self.login2()
        self.get_csrf()
        data ={ 'id': 1, 'score': 3, 'content': 'bye' }
        response = self.client.put('/api/plan/review/1/', json.dumps(data),
                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Review.objects.get(id=1).content, 'hi')
    def test_review_invalid_request(self):
        self.login1()
        self.get_csrf()
        response = self.client.post('/api/plan/review/1/', content_type='application/json',
                    HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 405)

class TokenTest(APITestCase):
    url = '/plan/token/'
    def get_csrf(self):
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
    def test_token_get(self):
        response = self.client.get('/api/plan/token/', content_type='application/json')
        self.assertEqual(response.status_code, 204)
    def test_token_invalid_request(self):
        self.get_csrf()
        response = self.client.post('/api/plan/review/1/',
                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 405)
