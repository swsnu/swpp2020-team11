from unittest.mock import patch
from django.test import TestCase, Client
import json

from common.util.test_utils import APITestCase, NotAllowedTestCase
from .models import User

stub_user = {
    'email': 'stub@email.com',
    'nickname': "stub nickname",
    'password': 'stub password',
    'phone_number': '010-1234-1234',
}


def setup_database():
    User.objects.create_user(**stub_user)


class AccountNotAllowedTestCase(NotAllowedTestCase):
    URL_PREFIX = '/api/user/'

    NOT_SUPPORTED_METHOD_CASE = [
        {'url': 'login/', 'method': 'get'},
        {'url': 'login/', 'method': 'put'},
        {'url': 'login/', 'method': 'delete'},
        {'url': 'logout/', 'method': 'post'},
        {'url': 'logout/', 'method': 'put'},
        {'url': 'logout/', 'method': 'delete'},
    ]

    NOT_AUTHORIZED_CHECK_CASE = [
        {'url': 'logout/', 'method': 'get'},
    ]


class SignUpTest(APITestCase):
    url = '/api/user/'

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
        setup_database()

    def test_post_with_valid_request(self):
        response = self.client.post(self.url, json.dumps(
            {'email': 'not_duplicated@email.com', 'nickname': 'not duplicated nickname', 'password': 'valid password'}),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(User.objects.get(email='not_duplicated@email.com'))

    @patch('account.models.User.objects.create_user')
    def test_post_with_not_completed_arguments(self, user_object_create_user):
        response = self.client.post(self.url,
                                    json.dumps({'email': 'not_duplicated@email.com', 'password': 'valid password'}),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(user_object_create_user.call_count, 0)

    def test_post_with_duplicated_email(self):
        response = self.client.post(self.url,
                                    json.dumps(stub_user),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 400)


class SignInTest(APITestCase):
    url = '/api/user/login/'

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
        self._setup_user_to_loggin()

    @patch('django.contrib.auth.login')
    def test_post_with_valid_request(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'valid@email.com', 'password': 'valid password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(auth_login_function.call_count, 1)

    @patch('django.contrib.auth.login')
    def test_post_with_not_existing_email(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'not_existing@email.com', 'password': 'valid password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(auth_login_function.call_count, 0)

    @patch('django.contrib.auth.login')
    def test_post_with_invalid_password(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'valid@email.com', 'password': 'wrong password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(auth_login_function.call_count, 0)


class SignOutTest(APITestCase):
    url = '/api/user/logout/'

    @patch('django.contrib.auth.logout')
    def test_post_with_valid_request(self, auth_logout_function):
        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(auth_logout_function.call_count, 1)


class UserModelTest(TestCase):
    def setUp(self):
        setup_database()

    def test_create_user_with_valid_case(self):
        new_user = stub_user.copy()
        new_user['email'] = 'valid@email2.com'
        user = User.objects.create_user(**new_user)
        self.assertEqual(user.phone_number, new_user['phone_number'])
        self.assertEqual(user.email, new_user['email'])
        self.assertEqual(user.nickname, new_user['nickname'])
        self.assertTrue(user.check_password(new_user['password']))

    def test_create_super_user_with_valid_case(self):
        new_superuser = stub_user.copy()
        new_superuser['email'] = 'valid@email2.com'
        new_superuser.pop('phone_number')
        user = User.objects.create_superuser(**new_superuser)
        self.assertEqual(user.phone_number, '')
        self.assertEqual(user.email, new_superuser['email'])
        self.assertEqual(user.nickname, new_superuser['nickname'])
        self.assertTrue(user.check_password(new_superuser['password']))
        self.assertTrue(user.is_superuser)

    def test_create_user_with_exist_email(self):
        self.assertRaises(ValueError, User.objects.create_user, None, "valid nickname", "valid password")

    def test_asdict_method(self):
        user = User.objects.first()
        self.assertEqual(user.as_dict()['email'], stub_user['email'])
