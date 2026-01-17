
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['your-domain.com']  # later

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'neurolearn_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'rds-endpoint',
        'PORT': '5432',
    }
}
