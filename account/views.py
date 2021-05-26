import datetime
from soch.settings import AAROGRA_SETU_API, AAROGYA_SETU_API_KEY, AAROGRA_SETU_API_PRODUCTION
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegistrationSerializer
from .twilio import broadcast_sms, check_verification, start_verification
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
        # start_verification(user.username)
        broadcast_sms([user.username], "Successfully registered on soch")
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# @permission_classes((AllowAny,))
# def verify_account(request):
#     code = request.data.get('code')
#     mobile = request.data.get('mobile')
#     if code and mobile:
#         res = check_verification(mobile, code)
#         print(res)
#         broadcast_sms(mobile, "Successfully registered on soch")
#         return Response({"msg": res})
#     return Response({"error": "provide mobile and code"})


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def request_otp(request):
    number = request.user.username
    url = f"{AAROGRA_SETU_API}/v2/auth/public/generateOTP"
    r = requests.post(url, headers=headers,
                      data=json.dumps({'mobile': number}))

    if r.status_code == 200:
        txnId = r.json()["txnId"]
        try:
            usrdata = CowinData.objects.get(user=request.user)
            usrdata.txnId = txnId
        except:
            usrdata = CowinData(user=request.user, txnId=txnId)
        usrdata.expiration_time = timezone.now() + datetime.timedelta(minutes=3)
        usrdata.save()
        return Response({"msg": "Pls enter the OTP"}, status=status.HTTP_200_OK)
    return Response({"error": r.status_code})


def get_token(otp, user):
    if user and otp:
        usrdata = CowinData.objects.get(user=user)
        data = {
            'txnId': usrdata.txnId,
            'otp': hashlib.sha256(otp.encode()).hexdigest()
        }
        r = requests.post(
            f'{AAROGRA_SETU_API}/v2/auth/public/confirmOTP', data=json.dumps(data))
        if r.status_code == 200:
            usrdata.token = r.json()['token']
            usrdata.save()
            return Response({"msg": "OTP verification successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Incorrect OTP provided. Try again"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def submit_otp(request):
    otp = request.data.get('otp')
    if otp:
        user_data = CowinData.objects.get(user=request.user)
        if user_data.expiration_time > timezone.now():
            get_token(otp, request.user)
        return Response({"error": "OTP Expired, regenerate OTP"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"error": "OTP not provided"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def delete_task(request):
    try:
        task_id = request.data.get('taskId')
    except Exception:
        return Response({'detail': 'No TASK_ID'}, status=status.HTTP_400_BAD_REQUEST)
    revoke_task(task_id)
    return Response({'detail': 'OK'}, status=status.HTTP_200_OK)
