import logging
import os

import boto3
from botocore.exceptions import ClientError
from asapgo.settings.base import S3_IMAGE_STORAGE

AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')


def create_presigned_post(bucket_name, object_name,
                          fields=None, conditions=None, expiration=300):
    region_name = 'ap-northeast-2'

    # Generate a presigned S3 POST URL
    s3_client = boto3.client(
        service_name='s3',
        aws_access_key_id=AWS_SECRET_KEY,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=region_name)
    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     Fields=fields,
                                                     Conditions=conditions,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL and required fields
    return response
