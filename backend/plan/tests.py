from common.util.test_utils import APITestCase, NotAllowedTestCase


def setup_database():
    pass


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
