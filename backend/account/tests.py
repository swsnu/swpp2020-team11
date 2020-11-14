import json

from unittest.mock import patch
from django.test import TestCase

from common.util.test_utils import APITestCase, NotAllowedTestCase
from account.models import User, PersonalityTestQuestion, Personality, PersonalityType

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
        {'url': 'token/', 'method': 'post'},
        {'url': 'token/', 'method': 'put'},
        {'url': 'token/', 'method': 'delete'},
        {'url': 'personality_check/', 'method': 'put'},
        {'url': 'personality_check/', 'method': 'delete'},
    ]

    NOT_AUTHORIZED_CHECK_CASE = [
        {'url': 'logout/', 'method': 'get'},
        {'url': 'personality_check/', 'method': 'get'},
        {'url': 'personality_check/', 'method': 'post'},
    ]


class SignUpTest(APITestCase):
    url = '/api/user/'
    user_for_login = None

    def _setup_database(self):
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
        self.assertEqual(response.status_code, 204)
        self.assertEqual(user_object_create_user.call_count, 0)

    def test_post_with_duplicated_email(self):
        response = self.client.post(self.url,
                                    json.dumps(stub_user),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)

    def test_get_without_authorization(self):
        response = self.client.get(self.url, content_type='application/json',
                                   HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 401)

    def test_get_with_authorization(self):
        self.client.post(self.url, json.dumps(
            {'email': 'valid@email.com', 'nickname': 'nickname', 'password': 'valid password'}),
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.client.post('/api/user/login/', {'email': 'valid@email.com', 'password': 'valid password'},
                        content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        response = self.client.get(self.url, content_type='application/json',
                                   HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertIn('{"id": 2, "email": "valid@email.com"}', response.content.decode())


class SignInTest(APITestCase):
    url = '/api/user/login/'
    user_for_login = None

    def _setup_database(self):
        setup_database()

    @patch('django.contrib.auth.login')
    def test_post_with_valid_request(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'stub@email.com', 'password': 'stub password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(auth_login_function.call_count, 1)

    @patch('django.contrib.auth.login')
    def test_post_with_not_existing_email(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'not_existing@email.com', 'password': 'valid password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(auth_login_function.call_count, 0)

    @patch('django.contrib.auth.login')
    def test_post_with_invalid_password(self, auth_login_function):
        response = self.client.post(self.url, {'email': 'stub@email.com', 'password': 'wrong password'},
                                    content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(auth_login_function.call_count, 0)


class TokenTest(APITestCase):
    url = '/api/user/token/'

    def test_get_with_valid_request(self):
        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)

    def test_get_with_not_logged_in_request(self):
        self.client.logout()
        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 401)


class SignOutTest(APITestCase):
    url = '/api/user/logout/'

    @patch('django.contrib.auth.logout')
    def test_post_with_valid_request(self, auth_logout_function):
        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(auth_logout_function.call_count, 1)


class PersonalityCheckTest(APITestCase):
    url = '/api/user/personality_check/'

    def _setup_database(self):
        for f_type in ['O', 'C', 'E', 'A', 'N']:
            p_type = PersonalityType(classification_type="big_five_factor", personality_type=f_type)
            p_type.save()
            for i in range(10):
                PersonalityTestQuestion(question=f'type {f_type} question {i}', type=p_type, weight=5).save()

    def test_get_questions_with_valid_case(self):
        response = self.client.get(self.url, HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)

    def test_save_personality_with_valid_case(self):
        test_result = {str(i): '3' for i in range(50)}
        response = self.client.post(self.url, test_result,
                                   content_type='application/json', HTTP_X_CSRFTOKEN=self.csrftoken)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Personality.objects.count(), 5)


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
