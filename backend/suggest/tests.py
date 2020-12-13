import datetime
from unittest.mock import patch

from django.utils import timezone

from common.util.test_utils import APITestCase, NotAllowedTestCase
from suggest.models import Suggestion
from account.models import User
from plan.models import Place, HashTag


def setup_suggest_database(user):
    now = timezone.make_aware(datetime.datetime.now())
    place = Place.objects.create(latitude=37.4772964, longitude=126.958394, type='음식',
                                 name='food', image_key='test1.jpg',
                                 status=1, avg_score=-1)
    tag1 = HashTag.objects.create(hashtag_name="first", feature=None)
    tag1.save()
    tag2 = HashTag.objects.create(hashtag_name="second", feature=None)
    tag2.save()
    tag3 = HashTag.objects.create(hashtag_name="third", feature=None)
    tag3.save()
    suggestion = Suggestion.objects.create(user=user, place=place, content="it is amazing",
                                           created_at=now, updated_at=now, status=1)
    suggestion.save()
    suggestion.hashtag.add(tag1, tag2, tag3)


class SuggestNotAllowedTestCase(NotAllowedTestCase):
    URL_PREFIX = '/api/suggest/'

    NOT_SUPPORTED_METHOD_CASE = [
        {'url': '', 'method': 'put'},
        {'url': '', 'method': 'delete'},
        {'url': '1/', 'method': 'post'},
        {'url': '1/', 'method': 'delete'},
        {'url': 'image_upload_presigned_url/', 'method': 'get'},
        {'url': 'image_upload_presigned_url/', 'method': 'put'},
        {'url': 'image_upload_presigned_url/', 'method': 'delete'},
    ]

    NOT_AUTHORIZED_CHECK_CASE = [
        {'url': '', 'method': 'get'},
        {'url': '', 'method': 'post'},
        {'url': '1/', 'method': 'get'},
        {'url': '1/', 'method': 'put'},
        {'url': 'image_upload_presigned_url/', 'method': 'post'},
    ]


class SuggestTest(APITestCase):
    url = '/api/suggest/'

    def _setup_database(self):
        self.user = User.objects.get(email=self.user_for_login.get('email'))

    def test_get_with_valid_request(self):
        setup_suggest_database(self.user)

        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json().get('suggestList')), 1)

    def test_post_with_valid_request(self):
        setup_suggest_database(self.user)

        response = self.client.post(self.url, {
            'location': {
                'lat': 0,
                'lng': 0,
            },
            'roadAddress': 'test',
            'extraAddress': 'test',
            'name': 'test',
            'hashedImageKey': 'test',
            'tags': 'test, asdf, first',
            'explanation': 'test'
        }, content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)


class SuggestDetailTest(APITestCase):
    url = '/api/suggest/1/'

    def _setup_database(self):
        self.user = User.objects.get(email=self.user_for_login.get('email'))

    def test_get_with_valid_request(self):
        setup_suggest_database(self.user)

        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)

    def test_put_with_valid_request(self):
        setup_suggest_database(self.user)

        response = self.client.put(self.url, {
            'location': {
                'lat': 0,
                'lng': 0,
            },
            'roadAddress': 'test',
            'extraAddress': 'test',
            'name': 'test',
            'hashedImageKey': 'test',
            'tags': 'test, asdf, first',
            'explanation': 'test'
        }, content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)


class ImageUploadPresignedUrl(APITestCase):
    url = '/api/suggest/image_upload_presigned_url/'

    @patch('suggest.views.create_presigned_post', return_value={"url": "test"})
    def test_post_with_valid_request(self, create_presigned_post):
        response = self.client.post(self.url, {'filename': 'filename.jpg'},
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(create_presigned_post.call_count, 1)
        self.assertEqual(response.status_code, 200)

    @patch('suggest.views.create_presigned_post', return_value=None)
    def test_post_with_invalid_request(self, create_presigned_post):
        response = self.client.post(self.url, {'filename': 'filename.jpg'},
                                    content_type='application/json',
                                    HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(create_presigned_post.call_count, 1)
        self.assertEqual(response.status_code, 400)
