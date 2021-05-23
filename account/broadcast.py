from django.conf import settings
from twilio.rest import Client


def broadcast_sms(recipients, msg_to_broadcast):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    for recipient in recipients:
        client.messages.create(
            to=recipient, from_=settings.TWILIO_NUMBER, body=msg_to_broadcast)
