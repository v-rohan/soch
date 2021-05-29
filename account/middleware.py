from .models import ReferrerId
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from soch.celery import sms_scheduler, revoke_task
from django.utils import timezone
from datetime import timedelta
from soch.settings import STATUS_CHECK_TIMEOUT
import json

class TaskMiddleWare():
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if 'recieved' not in request.path_info:
            try:
                response.data['taskId'] = request.META["HTTP_TASK_ID"]
                response._is_rendered = False 
                response.render()
            except Exception:
                pass
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        if 'admin' in request.path_info or 'login' in request.path_info or 'register' in request.path_info:
            return None
        try:
            referrer_id = request.META['HTTP_REFERRER_ID']
        except Exception:
            return JsonResponse({'detail': 'No REFERRER_ID'}, status=status.HTTP_400_BAD_REQUEST)
        if referrer_id:
            user = ReferrerId.objects.get(referrer_id=referrer_id).user
            request.user = user
            if 'recieved' not in request.path_info:
                now = timezone.now()
                exec_time = now + timedelta(seconds=STATUS_CHECK_TIMEOUT)
                task = sms_scheduler.apply_async(({
                    'user': request.user.pk,
                    'path_info': request.path_info
                }, ), eta=exec_time)
                request.META["HTTP_TASK_ID"] = task.id
            return None
