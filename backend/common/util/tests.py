import json
import os
from unittest import TestCase
from unittest.mock import Mock, patch

import responses

from common.util.http_util import suggestion_algorithm, time_distance
from common.util.aws_util import create_presigned_post

os.environ.setdefault('AWS_SECRET_KEY', 'AWS_SECRET_KEY')
os.environ.setdefault('AWS_SECRET_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY')
os.environ.setdefault('REACT_APP_API_KEY', 'REACT_APP_API_KEY')


def client_error_callable(*args, **kwargs):
    raise Exception


class AWSUtilTest(TestCase):

    @patch('common.util.aws_util.boto3.client')
    def test_invalid(self, client):
        client.return_value = Mock()
        client.return_value.generate_presigned_post = Mock()
        client.return_value.generate_presigned_post.side_effect = client_error_callable

        return_value = create_presigned_post('', '')

        self.assertIsNone(return_value)

    @patch('common.util.aws_util.boto3.client')
    def test_valid(self, client):
        client.return_value = Mock()
        client.return_value.generate_presigned_post = Mock()
        client.return_value.generate_presigned_post.return_value = {'url': 'isvalidurl.com'}

        return_value = create_presigned_post('', '')

        self.assertEqual(return_value, {'url': 'isvalidurl.com'})


class SuggestPlanUtilTest(TestCase):

    @responses.activate
    def test_invalid(self):
        responses.add(responses.POST, 'http://lambda_mock.com', status=400,
                      content_type='application/json')
        self.assertIsNone(suggestion_algorithm({}))

    @responses.activate
    def test_valid(self):
        res_data = {'result': []}
        responses.add(responses.POST, 'http://lambda_mock.com', status=200,
                      body=json.dumps(res_data),
                      content_type='application/json')
        result = suggestion_algorithm({})
        self.assertEqual(result, res_data)

    @patch('common.util.http_util.requests.post')
    def test_raise(self, post):
        post.side_effect = client_error_callable
        self.assertIsNone(suggestion_algorithm({}))


class TimeDistanceTest(TestCase):

    @responses.activate
    def test_valid(self):
        places = [
            {'lng': 0, 'lat': 0},
            {'lng': 1, 'lat': 1},
            {'lng': 2, 'lat': 2}
        ]
        res_data = {
            'rows': [
                {'elements': [
                    {'distance': 1, 'duration': 1},
                    {'distance': 2, 'duration': 2},
                    {'distance': 3, 'duration': 3}
                ]},
                {'elements': [
                    {'distance': 11, 'duration': 11},
                    {'distance': 12, 'duration': 12},
                    {'distance': 13, 'duration': 13}
                ]},
                {'elements': [
                    {'distance': 21, 'duration': 21},
                    {'distance': 22, 'duration': 22},
                    {'distance': 23, 'duration': 23}
                ]},
            ]
        }
        responses.add(responses.GET, 'https://maps.googleapis.com/maps/api/distancematrix/json',
                      status=200, body=json.dumps(res_data), content_type='application/json')
        result = time_distance(0, 0, places)
        self.assertEqual(result, ([3, 1, 12, 23], [3, 1, 12, 23]))
