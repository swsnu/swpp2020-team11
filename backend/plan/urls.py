from django.urls import path
from plan import views


urlpatterns = [
    path('', views.plan, name='plan'),
    path('token/', views.token, name='token'),
    path('reservation/', views.plan_reservation, name='planReservation'),
    path('history/', views.history, name='history'),
    path('review/<int:ids>/', views.review_detail, name='reviewDetail'),
    path('review/', views.review, name='review')
]
