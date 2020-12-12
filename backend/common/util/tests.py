from unittest import TestCase
from unittest.mock import Mock, patch
from botocore.exceptions import ClientError

from common.util.aws_util import create_presigned_post


def client_error_callable(*args, **kwargs):
    raise ClientError({}, '')


class AWSUtil(TestCase):

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
