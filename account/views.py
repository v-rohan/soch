from soch.settings import AAROGRA_SETU_API
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegistrationSerializer
from .broadcast import broadcast_sms
import requests
from .models import CowinData
import hashlib


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
        # broadcast_sms([user.username], "Successfully registered on soch")
        return Response(data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes((AllowAny,))
def request_otp(number, user):
    if number:
        r = requests.post(f'{AAROGRA_SETU_API}/v2/auth/public/generateOTP/', data={'number': number})
        if r.status_code == 200:
            txnId = r.json()["txnId"]
            try:
                usrdata = CowinData.objects.get(user=user)
                usrdata.txnId = txnId
            except:
                usrdata = CowinData(user=user, txnId=txnId)
            usrdata.save()
            return True
    return False


@api_view(['POST'])
@permission_classes((AllowAny,))
def get_token(otp, user):
    if user and otp:
        usrdata = CowinData.objects.get(user=user)
        data = {
            'txnId': usrdata.txnId,
            'otp': hashlib.sha256(otp.encode()).hexdigest()
        }
        r = requests.post(f'{AAROGRA_SETU_API}/v2/auth/public/confirmOTP', data=data)
        if r.status_code == 200:
            usrdata.token = r.json()['token']
            usrdata.save()
        return True
    return False
