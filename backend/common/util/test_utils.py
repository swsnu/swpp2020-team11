from django.test import TestCase, Client

from account.models import User


class APITestCase(TestCase):
    csrftoken = None
    CSRF_CHECK_URL = '/api/user/logout/'

    user_for_login = {
        'email': 'valid@email.com',
        'nickname': "valid nickname",
        'password': 'valid password',
        'phone_number': '010-1234-1234',
    }

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value
        self._setup_user_to_loggin()
        self._setup_database()
        self.client.login(username=self.user_for_login['email'], password=self.user_for_login['password'])

    def _setup_user_to_loggin(self):
        User.objects.create_user(**self.user_for_login)

    def _setup_database(self):
        pass


class NotAllowedTestCase(APITestCase):
    URL_PREFIX = ''
    NOT_SUPPORTED_METHOD_CASE = []
    NOT_AUTHORIZED_CHECK_CASE = []

    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        response = self.client.get(self.CSRF_CHECK_URL)
        self.csrftoken = response.cookies['csrftoken'].value

    def _get_simple_response(self, case):
        url = case.get('url', None)
        method = case.get('method', None)
        self.assertIsNotNone(url)
        self.assertIsNotNone(method)
        request = getattr(self.client, method)
        response = request(self.URL_PREFIX + url, HTTP_X_CSRFTOKEN=self.csrftoken)
        return response

    def test_not_supported_method(self):
        for case in self.NOT_SUPPORTED_METHOD_CASE:
            response = self._get_simple_response(case)
            self.assertEqual(response.status_code, 405)

    def test_articles_get_with_unauthorized_user(self):
        for case in self.NOT_AUTHORIZED_CHECK_CASE:
            response = self._get_simple_response(case)
            self.assertEqual(response.status_code, 401)
