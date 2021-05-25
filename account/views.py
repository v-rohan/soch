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


headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
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
        start_verification(user.username)
        # broadcast_sms([user.username], "Successfully registered on soch")
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def verify_account(request):
    code = request.data.get('code')
    mobile = request.data.get('mobile')
    if code and mobile:
        res = check_verification(mobile, code)
        print(res)
        broadcast_sms(mobile, "Successfully registered on soch")
        return Response({"msg": res})
    return Response({"error": "provide mobile and code"})


@api_view(['POST'])
@permission_classes((AllowAny,))
def request_otp(request):
    number = request.data.get('number')
    if number:
        url = f"{AAROGRA_SETU_API_PRODUCTION}/v2/auth/public/generateOTP/"
        r = requests.post(url, headers=headers,
                          data=json.dumps({'mobile': number}))

        if r.status_code == 200:
            txnId = r.json()["txnId"]
            try:
                user = User.objects.get(username=number)
                usrdata = CowinData.objects.get(user=user)
                usrdata.txnId = txnId
            except:
                usrdata = CowinData(user=user.objects.get(
                    username=number), txnId=txnId)
            usrdata.expiration_time = datetime.datetime.now() + datetime.timedelta(minutes=3)
            usrdata.save()
            return Response({"msg": "OTP sent successfully, pls enter the OTP"}, status=status.HTTP_200_OK)
        return Response({"error": r.text})
    return Response({"error": "Please provide mobile number"}, status=status.HTTP_400_BAD_REQUEST)


def get_token(otp, user):
    if user and otp:
        usrdata = CowinData.objects.get(user=user)
        data = {
            'txnId': usrdata.txnId,
            'otp': hashlib.sha256(otp.encode()).hexdigest()
        }
        r = requests.post(
            f'{AAROGRA_SETU_API}/v2/auth/public/confirmOTP', data=data)
        if r.status_code == 200:
            usrdata.token = r.json()['token']
            usrdata.save()
        return True
    return False


@api_view(['POST'])
@permission_classes((AllowAny,))
def receive_otp(otp, mobile):
    if mobile and otp:
        user = User.objects.get(username=mobile)
        user_data = CowinData.objects.get(user=user)
        if user_data.expiration_time > datetime.datetime.now():
            get_token(otp, user)
        return Response({"error": "OTP Expired, regenerate OPT"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({"error": "Provide otp and mobile"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def delete_task(request):
    try:
        task_id = request.data.get('taskId')
    except Exception:
        return Response({'detail': 'No TASK_ID'}, status=status.HTTP_400_BAD_REQUEST)
    revoke_task(task_id)
    return Response({'detail': 'OK'}, status=status.HTTP_200_OK)
