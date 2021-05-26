from rest_framework import serializers


class BenificiarySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    birth_year = serializers.IntegerField(max_length=4)
    gender_id = serializers.IntegerField(max_length=1)
    photo_id_type = serializers.IntegerField(max_length=1)
    photo_id_number = serializers.CharField(max_length=12)
    comorbidity_ind = serializers.CharField(max_length=1)
    consent_version = serializers.CharField(max_length=1)
