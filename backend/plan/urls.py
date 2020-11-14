from django.urls import path
from plan import views


urlpatterns = [
    path('', views.suggested_plan, name='plan'),
    path('reservation/', views.plan_reservation, name='planReservation'),
    path('history/', views.history, name='history'),
    path('review/<int:ids>/', views.review_detail, name='reviewDetail'),
    path('review/', views.review, name='review')
]
