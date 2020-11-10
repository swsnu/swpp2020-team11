from django.urls import path
from .views import plan, planReservation

urlpatterns = [
    path('', plan, name='plan'),
    path('reservation/', planReservation, name='planReservation'),
]
