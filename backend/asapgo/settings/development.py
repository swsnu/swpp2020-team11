# SECURITY WARNING: don't run with debug turned on in production!
import os
from pathlib import Path
import dotenv

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
dotenv.read_dotenv(dotenv=ROOT_DIR + "/.env")

DEBUG = True

ALLOWED_HOSTS = ["*"]

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]

CORS_ORIGIN_WHITELIST = ["http://localhost:3000"]

S3_IMAGE_STORAGE = "asapgo-development"
