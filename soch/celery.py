from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
from celery import shared_task


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soch.settings')
app = Celery('soch')


app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@shared_task(bind=True, 
    name="task to check status after sometime", max_retries=3)
def sms_scheduler(request, *args, **kwargs):
    print(request)


def revoke_task(task_id):
    res = app.control.revoke(task_id, terminate=True)
    return res