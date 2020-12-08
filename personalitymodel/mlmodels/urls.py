from django.urls import path
from mlmodels import views

urlpatterns = [
    path('',views.personality, name='personality'),
]
