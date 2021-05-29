from rest_framework import viewsets
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

    @action(detail=False, methods=['GET',])
    def test(self, request):
        return Response({"data": "OK"}, status=status.HTTP_200_OK)


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
        # r = requests.get(
        #     f'{AAROGRA_SETU_API}/v2/appointment/sessions/public/{time}ByPin', params=params, headers=headers)
        # print(r)
        # if r.status_code == 200:
        #     return Response({"detail": r.json()})
        # else:
        #     return Response({"error": "Input parameter missing"}, status=status.HTTP_400_BAD_REQUEST)
        if time == 'calendar':
            return Response({"detail": json.dumps({"centers": [{"center_id": 1234,"name": "District General Hostpital","name_l": "","address": "45 M G Road","address_l": "","state_name": "Maharashtra","state_name_l": "","district_name": "Satara","district_name_l": "","block_name": "Jaoli","block_name_l": "","pincode": "413608","lat": 28.7,"long": 77.1,"from": "09:00:00","to": "18:00:00","fee_type": "Free","vaccine_fees": [{"vaccine": "COVISHIELD","fee": "250"}],"sessions": [{"session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","date": "31-05-2021","available_capacity": 50,"available_capacity_dose1": 25,"available_capacity_dose2": 25,"min_age_limit": 18,"vaccine": "COVISHIELD","slots": ["FORENOON","AFTERNOON"]}]}]})}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": json.dumps({"sessions": [{"center_id": 1234,"name": "District General Hostpital","name_l": "","address": "45 M G Road","address_l": "","state_name": "Maharashtra","state_name_l": "","district_name": "Satara","district_name_l": "","block_name": "Jaoli","block_name_l": "","pincode": "413608","lat": 28.7,"long": 77.1,"from": "09:00:00","to": "18:00:00","fee_type": "Paid","fee": "250","session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","date": "31-05-2021","available_capacity": 50,"available_capacity_dose1": 25,"available_capacity_dose2": 25,"min_age_limit": 18,"vaccine": "COVISHIELD","slots": ["FORENOON","AFTERNOON"]}]})}, status=status.HTTP_200_OK)

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
        # r = requests.get(
        #     f'{AAROGRA_SETU_API}​/v2​/appointment​/sessions​/public​/{time}ByDistrict',  params=params, headers=headers)
        # if r.status_code == 200:
        #     return Response({"detail": r.json()})
        # else:
        #     return Response({"error": "Input parameter missing or invalid"}, status=status.HTTP_400_BAD_REQUEST)
        if time == 'calendar':
            return Response({"detail": json.dumps({"centers": [{"center_id": 1234,"name": "District General Hostpital","name_l": "","address": "45 M G Road","address_l": "","state_name": "Maharashtra","state_name_l": "","district_name": "Satara","district_name_l": "","block_name": "Jaoli","block_name_l": "","pincode": "413608","lat": 28.7,"long": 77.1,"from": "09:00:00","to": "18:00:00","fee_type": "Free","vaccine_fees": [  {    "vaccine": "COVISHIELD",    "fee": "250"  }],"sessions": [{"session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","date": "31-05-2021","available_capacity": 50,"available_capacity_dose1": 25,"available_capacity_dose2": 25,"min_age_limit": 18,"vaccine": "COVISHIELD","slots": ["FORENOON","AFTERNOON"]}]}]})}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": json.dumps({"sessions": [{"center_id": 1234,"name": "District General Hostpital","name_l": "","address": "45 M G Road","address_l": "","state_name": "Maharashtra","state_name_l": "","district_name": "Satara","district_name_l": "","block_name": "Jaoli","block_name_l": "","pincode": "413608","lat": 28.7,"long": 77.1,"from": "09:00:00","to": "18:00:00","fee_type": "Paid","fee": "250","session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","date": "31-05-2021","available_capacity": 50,"available_capacity_dose1": 25,"available_capacity_dose2": 25,"min_age_limit": 18,"vaccine": "COVISHIELD","slots": ["FORENOON","AFTERNOON"]}]})}, status=status.HTTP_200_OK)
    @action(detail=False, methods=['POST'])
    def getCalendarByCenter(self, request):
        center_id = request.data.get('center_id')
        date = datetime.date.fromisoformat(request.data.get('date', None)).strftime(
            "%d-%m-%Y") if request.data.get('date', None) is not None else None
        params = {"center_id": center_id, "date": date}
        r = requests.get(
            f"{AAROGRA_SETU_API}/v2/appointment/sessions/public/calendarByCenter", params=params, headers=headers)
        if r.status_code == 200:
            return Response({"detail": r.json()})
        else:
            return Response({"error": "Input parameter missing"}, status=status.HTTP_400_BAD_REQUEST)


class MetaDataViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["GET"])
    def getStates(self, request):
        r = requests.get(f"{AAROGRA_SETU_API}​/v2​/admin​/location​/states")
        if r.status_code == 200:
            return Response({"detail": r.json()})
        else:
            print(r.status_code)
            return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def getDistricts(self, request):
        state_id = request.data.get('state')
        r = requests.get(f"{AAROGRA_SETU_API}/v2/admin/location/districts",
                         params={'state_id': state_id}, headers=headers)
        if r.status_code == 200:
            return Response({'data': r.json()})
        return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def register_benificiary(request):
    user = CowinData.objects.get(user=request.user)
    bearer_token = user.token
    headers['Authorization'] = f"Bearer {bearer_token}"
    data = request.data
    url = f"{AAROGRA_SETU_API}/v2/registration/beneficiary/new"
    r = requests.post(url, headers=headers, data=json.dumps(data))
    if r.status_code == 200:
        user.beneficiary_reference_id = r.json()['beneficiary_reference_id']
        user.save()
        return Response({'detail': 'Benificiary Registered Successfully. Your benificiary id is {}'.format(user.beneficiary_reference_id)}, status=status.HTTP_200_OK)
    return Response({"error": f"Error: {r.status_code}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def book_appointment(request):
    user = CowinData.objects.get(user=request.user)
    dose = request.data.get('dose')
    slot = request.data.get('slot')
    session_id = request.data.get('session')
    if dose and session_id and slot:

        if user.appointment_id_2:
            return Response({'error': 'Already Vaccinated'}, status=status.HTTP_400_BAD_REQUEST)

        if dose == 1 and user.appointment_id_1:
            return Response({'error': 'Already Vaccinated for Dose 1'}, status=status.HTTP_400_BAD_REQUEST)

        if dose == 2 and not user.appointment_id_1:
            return Response({'error': 'First Register for Dose 1'}, status=status.HTTP_400_BAD_REQUEST)

        headers['Authorization'] = f"Bearer {user.token}"
        url = f"{AAROGRA_SETU_API}/v2/appointment/schedule"
        data = {
            'dose': dose,
            'session_id': session_id,
            'slot': slot,
            'benificiaries': [user.beneficiary_reference_id]
        }
        r = requests.post(url, headers=headers, data=json.dumps(data))
        if r.status_code == 200:
            if dose == 1:
                user.appointment_id_1 = r.json()['appointment_id']
            else:
                user.appointment_id_2 = r.json()['appointment_id']
            user.save()

            return Response({'detail': f'Booking Successful for dose {dose}'}, status=status.HTTP_200_OK)
        return Response({"error": r.status_code}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'error': 'Provide the necessary details'}, status=status.HTTP_400_BAD_REQUEST)
