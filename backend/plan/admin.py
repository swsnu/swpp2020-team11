from django.contrib import admin
from .models import Plan, HalfDayOff, TransportationReservation, Taxi, PlaceReservation, Place, Review, Features

# Register your models here.
admin.site.register(Plan)
admin.site.register(HalfDayOff)
admin.site.register(TransportationReservation)
admin.site.register(Taxi)
admin.site.register(PlaceReservation)
admin.site.register(Place)
admin.site.register(Review)
admin.site.register(Features)
