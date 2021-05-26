from rest_framework import views, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from account.models import CowinData
import requests
import datetime
import json

from soch.settings import AAROGRA_SETU_API

headers = {
    "accept": "application/json",
    'Content-Type': 'application/json',
}


class AppSessionViewSet(viewsets.ViewSet):
    # permission_classes = (AllowAny)

    @action(detail=False, methods=['POST'])
    def getByPin(self, request):
        pincode = (request.data.get('pincode'))
        date = datetime.date.fromisoformat(request.data.get('date', None)).strftime(
            "%d-%m-%Y") if request.data.get('date', None) is not None else None
        params = {"pincode": pincode, "date": date}
        print(params)
        if request.data.get('calendar', False):
            time = "calendar"
        else:
            time = "find"
        r = requests.get(
            f'{AAROGRA_SETU_API}/v2/appointment/sessions/public/{time}ByPin', params=params, headers=headers)
        print(r)
        if r.status_code == 200:
            return Response({"data": r.json()})
        else:
            return Response({"detail": "Input parameter missing"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def getByDistrict(self, request):
        district_id = request.data.get('district')
        date = datetime.date.fromisoformat(request.data.get('date', None)).strftime(
            "%d-%m-%Y") if request.data.get('date', None) is not None else None
        params = {"district_id": district_id, "date": date}
        if request.data.get('calendar', False):
            time = "calendar"
        else:
            time = "find"
        r = requests.get(
            f'{AAROGRA_SETU_API}​/v2​/appointment​/sessions​/public​/{time}ByDistrict',  params=params, headers=headers)
        if r.status_code == 200:
            return Response({"data": r.json()})
        else:
            return Response({"detail": "Input parameter missing or invalid"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def getCalendarByCenter(self, request):
        center_id = request.data.get('center_id')
        date = datetime.date.fromisoformat(request.data.get('date', None)).strftime(
            "%d-%m-%Y") if request.data.get('date', None) is not None else None
        params = {"center_id": center_id, "date": date}
        r = requests.get(
            f"{AAROGRA_SETU_API}/v2/appointment/sessions/public/calendarByCenter", params=params, headers=headers)
        if r.status_code == 200:
            return Response({"data": r.json()})
        else:
            return Response({"detail": "Input parameter missing"}, status=status.HTTP_400_BAD_REQUEST)


class MetaDataViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["GET"])
    def getStates(self, request):
        r = requests.get(f"{AAROGRA_SETU_API}​/v2​/admin​/location​/states")
        if r.status_code == 200:
            return Response({"data": r.json()})
        else:
            print(r.status_code)
            return Response({"detail": "Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def getDistricts(self, request):
        state_id = request.data.get('state')
        r = requests.get(f"{AAROGRA_SETU_API}/v2/admin/location/districts",
                         params={'state_id': state_id}, headers=headers)
        if r.status_code == 200:
            return Response({'data': r.json()})
        return Response({"detail": "Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def register_benificiary(request):
    bearer_token = CowinData.objects.get(user=request.user).token
    headers['Authorization'] = f"Bearer {bearer_token}"
    data = request.data
