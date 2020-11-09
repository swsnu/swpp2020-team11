from django.urls import path
from plan import views

urlpatterns = [
    path('', views.plan, name='plan'),
    path('history/', views.history, name='history'),
    path('review/<int:id>/', views.reviewDetail, name='reviewDetail'),
    path('review/', views.review, name='review')
]
