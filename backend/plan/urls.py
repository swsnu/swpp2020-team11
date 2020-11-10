from django.urls import path
from .views import plan, reservation

urlpatterns = [
    path('', plan, name='plan'),
    path('reservation/', reservation, name='reservation'),
]
