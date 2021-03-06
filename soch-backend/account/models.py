from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.models import Token
import hashlib


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        ReferrerId(
            user=instance,
            referrer_id=hashlib.sha256(instance.username.encode()).hexdigest()
        ).save()
        Token.objects.create(user=instance)


class ReferrerId(models.Model):
    referrer_id = models.CharField(max_length=64)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.user.username


class CowinData(models.Model):
    txnId = models.CharField(max_length=40, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    expiration_time = models.DateTimeField(default=timezone.now)
    token = models.TextField(blank=True)
    beneficiary_reference_id = models.CharField(max_length=13, blank=True)
    appointment_id_1 = models.CharField(max_length=40, default='')
    appointment_id_2 = models.CharField(max_length=40, default='')

    def __str__(self) -> str:
        return self.user.username
