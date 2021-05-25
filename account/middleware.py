from .models import ReferrerId
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


class TaskMiddleWare():
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_view(self, request, view_func, view_args, view_kwargs):
        if 'admin' in request.path_info:
            return None
        try:
            # print(request.META)
            referrer_id = request.META['HTTP_REFERRER_ID']
        except Exception:
            return JsonResponse({'detail': 'No REFERRER_ID'}, status=status.HTTP_400_BAD_REQUEST)
        if referrer_id:
            try:
                user = ReferrerId.objects.get(referrer_id=referrer_id).user
                if request.path_info != '':
                    # TODO ADD REQUEST ENTRY TO TASK QUEUE
                    pass
                else:
                    #TODO REMOVE ENTRY FROM TASK QUEUE
                    pass
                return None
            except Exception:
                return JsonResponse({'detail': 'No REFERRER_ID'}, status=status.HTTP_400_BAD_REQUEST)

