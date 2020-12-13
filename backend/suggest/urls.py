from django.urls import path
from suggest import views

urlpatterns = [
    path('', views.suggest_list, name='suggest'),
    path('<int:suggest_id>/', views.suggest, name='suggest_list'),
    path('image_upload_presigned_url/', views.image_upload_presigned_url, name='image_upload'),
]
