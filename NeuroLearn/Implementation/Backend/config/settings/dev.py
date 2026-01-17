
from .base import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # PostgreSQL engine
        'NAME': os.getenv("DB_NAME"),               # from .env
        'USER': os.getenv("DB_USER"),               # from .env
        'PASSWORD': os.getenv("DB_PASSWORD"),       # from .env
        'HOST': os.getenv("DB_HOST"),               # usually localhost for dev
        'PORT': os.getenv("DB_PORT"),               # usually 5432
    }
}