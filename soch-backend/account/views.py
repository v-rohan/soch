import datetime
from soch.settings import AAROGRA_SETU_API, AAROGYA_SETU_API_KEY, AAROGRA_SETU_API_PRODUCTION
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegistrationSerializer
from .twilio import broadcast_sms
import requests
from .models import CowinData
import hashlib
from soch.celery import revoke_task
import json
from django.utils import timezone

headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': AAROGYA_SETU_API_KEY,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
}


@api_view(['POST'])
@permission_classes((AllowAny,))
def registration_view(request):
    serializer = RegistrationSerializer(data=request.data)
    data = {}
    if serializer.is_valid():
        user = serializer.save()
        data['response'] = "User Registered Successfully"
        data['user'] = user.username
        data['token'] = Token.objects.get(user=user).key
        broadcast_sms([user.username], "Successfully registered on soch")
        return Response({'detail': data}, status=status.HTTP_201_CREATED)
    return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def request_otp(request):
    number = request.user.username
    url = f"{AAROGRA_SETU_API}/v2/auth/generateOTP"
    r = requests.post(url, headers=headers,
                      data=json.dumps({'mobile': number}))

    if r.status_code == 200:
        txnId = r.json()["txnId"]
        try:
            usrdata = CowinData.objects.get(user=request.user)
            usrdata.txnId = txnId
        except:
            usrdata = CowinData(user=request.user, txnId=txnId)
        # usrdata.expiration_time = timezone.now() + datetime.timedelta(minutes=3)
        usrdata.save()
        return Response({"detail": "Pls enter the OTP"}, status=status.HTTP_200_OK)
    return Response({"error": f"Error: {r.status_code}"})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def submit_otp(request):
    otp = request.data.get('otp')
    if otp:
        user_data = CowinData.objects.get(user=request.user)
        # if user_data.expiration_time > timezone.now():
        data = {
            'txnId': user_data.txnId,
            'otp': hashlib.sha256(otp.encode()).hexdigest()
        }
        url = f'{AAROGRA_SETU_API}/v2/auth/confirmOTP'
        r = requests.post(url, headers=headers, data=json.dumps(data))
        if r.status_code == 200:
            user_data.token = r.json()['token']
            user_data.save()
            return Response({"detail": "OTP verification successful"}, status=status.HTTP_200_OK)
        return Response({"error": f"{r.status_code}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response({"error": "OTP not provided"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def delete_task(request):
    try:
        task_id = request.data.get('taskId')
    except Exception:
        return Response({'error': 'No TASK_ID'}, status=status.HTTP_400_BAD_REQUEST)
    revoke_task(task_id)
    return Response({'detail': 'OK'}, status=status.HTTP_200_OK)
