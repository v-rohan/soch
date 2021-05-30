from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'appts', views.AppSessionViewSet, basename="appointView")
router.register(r'meta', views.MetaDataViewSet, basename="metadataView")

urlpatterns = [
    path('', include(router.urls)),
    path('add/', views.register_benificiary),
    path('book/', views.book_appointment),
    path('book-dummy/', views.book_appointment_dummy)
]
