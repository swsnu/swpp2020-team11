from django.urls import path
from suggest import views

urlpatterns = [
    path('', views.suggest_list, name='suggest'),
    path('<int:suggest_id>/', views.suggest, name='suggest_list'),
]
