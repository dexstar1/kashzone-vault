from __future__ import absolute_import
from django.conf import settings
import os
from celery import Celery

# setting DjanoSETTTINGS as default
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vault.settings')


app = Celery(broker=settings.CELERY_BROKER_URL)
app.config_from_object('django.conf.settings')
app.autodiscover_tasks(settings.INSTALLED_APPS)

if __name__ == '__main__':
    app.start()
