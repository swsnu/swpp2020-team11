from django.urls import path
from .views import plan

urlpatterns = [
    path('', plan, name='plan'),
]
