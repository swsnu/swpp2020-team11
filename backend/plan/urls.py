from django.urls import path
from plan import views

urlpatterns = [
    path('place/', views.place, name='place')
]
