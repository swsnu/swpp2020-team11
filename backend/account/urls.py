from django.urls import path
from .views import *

urlpatterns = [
    path('login/', sign_in, name='signin'),
    path('logout/', sign_out, name='signout'),
]
