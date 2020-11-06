from django.urls import path
from .views import sign_in, sign_out, sign_up

urlpatterns = [
    path('/', sign_up, name='signup'),
    path('login/', sign_in, name='signin'),
    path('logout/', sign_out, name='signout'),
]
