from django.contrib import admin
from .models import Plan, HalfDayOffReservation, TransportationReservation, \
    Taxi, PlaceReservation, Place, Review, Features

# Register your models here.
admin.site.register(Plan)
admin.site.register(HalfDayOffReservation)
admin.site.register(TransportationReservation)
admin.site.register(Taxi)
admin.site.register(PlaceReservation)
admin.site.register(Place)
admin.site.register(Review)
admin.site.register(Features)
