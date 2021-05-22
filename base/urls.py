from django.urls import include, path
from rest_framework import routers, urlpatterns
from . import views

router = routers.DefaultRouter()
router.register(r'appts', views.AppSessionViewSet, basename="appointView")
router.register(r'meta', views.MetaDataViewSet, basename="metadataView")

urlpatterns = [
    path('', include(router.urls)),
]