from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Create your models here.


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class CowinData(models.Model):
    txnId = models.CharField(max_length=40, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.TextField(blank=True)