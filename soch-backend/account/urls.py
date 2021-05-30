from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

app_name = "account"

urlpatterns = [
    path('register/', views.registration_view, name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('recieved/', views.delete_task),
    path('requestotp/', views.request_otp),
    path('submitotp/', views.submit_otp)
]
