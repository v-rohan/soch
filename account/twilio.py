from django.conf import settings
from twilio.rest import Client


def broadcast_sms(recipient, msg_to_broadcast):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    client.messages.create(
        to=f"+91{recipient}", from_=settings.TWILIO_NUMBER, body=msg_to_broadcast)
    print("Message sent successfully")


def start_verification(to, channel='sms'):
    if channel not in ('sms', 'call'):
        channel = 'sms'
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    service = settings.TWILIO_SERVICE_SID

    verification = client.verify.services(
        service).verifications.create(to=f"+91{to}", channel=channel)

    return verification.sid


def check_verification(phone, code):
    service = settings.TWILIO_SERVICE_SID
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    try:
        verification_check = client.verify \
            .services(service) \
            .verification_checks \
            .create(to=f"+91{phone}", code=code)

        if verification_check.status == "approved":
            return 'Your phone number has been verified! Please login to continue.'

        else:
            return 'The code you provided is incorrect. Please try again.'

    except Exception as e:
        return "Error validating code: {}".format(e)
