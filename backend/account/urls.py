from django.urls import path
from account import views

urlpatterns = [
    path('', views.sign_up, name='signup'),
    path('login/', views.sign_in, name='signin'),
    path('logout/', views.sign_out, name='signout'),
    path('token/', views.token, name='token'),
    path('personality_check/', views.personality_check, name='personality_check'),
]
