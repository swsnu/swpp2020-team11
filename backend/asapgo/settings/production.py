from .secret_manager import get_secret

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['localhost:3000']

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

CORS_ORIGIN_WHITELIST = ['http://localhost:3000']
