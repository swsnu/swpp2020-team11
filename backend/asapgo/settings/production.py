from .secret_manager import get_secret

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_secret('asapgo-database').get('DATABASE'),
        'USER': get_secret('asapgo-database').get('USER'),
        'PASSWORD': get_secret('asapgo-database').get('PASSWORD'),
        'HOST': get_secret('asapgo-database').get('HOST'),
        'PORT': get_secret('asapgo-database').get('PORT'),
    }
}
CORS_ALLOWED_ORIGINS = ["http://trip.asapgo.net.s3-website.ap-northeast-2.amazonaws.com",
                        "https://www.asapgo.net",
                        "https://localhost:3000",
                        "http://localhost:3000"]

CORS_ORIGIN_WHITELIST = ["http://trip.asapgo.net.s3-website.ap-northeast-2.amazonaws.com",
                         "https://www.asapgo.net",
                         "https://localhost:3000",
                         "http://localhost:3000"]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'Access-Control-Allow-Origin',
    'x-requested-with',
]

S3_IMAGE_STORAGE = "asapgo-development"
