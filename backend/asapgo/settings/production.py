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

CORS_ORIGIN_WHITELIST = ["https://trip.asapgo.net"]

CSRF_TRUSTED_ORIGINS = ["trip.asapgo.net"]

S3_IMAGE_STORAGE = "asapgo-development"
