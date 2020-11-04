from django.db import models
from django.contrib.auth.models import User

class Plan(models.Model):
  user = models.ForeignKey(
    User,
    on_delete = models.CASCADE,
    related_name = 'user_plan'
  )
  head_count = models.IntegerField()
  created_at = models.DateTimeField(auto_now_add=True)
  started_at = models.DateTimeField(null=True)
  ended_at = models.DateTimeField(null=True)
  feedback = models.TextField() #temporary

class Features(models.Model):
  feature_name = models.CharField(max_length=32)
  status = models.IntegerField()
  places = models.ManyToManyField(
    Place,
    related_name = 'places'
  )

class Place(models.Model):
  latitude = models.FloatField()
  longitude = models.FloatField()
  type = models.CharField(max_length=64)
  features = models.ManyToManyField(
    Features,
    related_name = 'features'
  ) #temporary
  # image_urls = models.FilePathField(default='img.jpg')
  status = models.IntegerField() #temporary
  avg_score = models.FloatField()

class PlaceReservation(models.Model):
  place = models.ForeignKey(
    Place,
    on_delete = models.CASCADE,
    related_name = "place"
  )
  reservation_name = models.CharField(max_length=64)
  reservation_time = models.DateTimeField(auto_now_add=True)
  status = models.IntegerField() #temporary
  head_count = models.IntegerField() #temporary
  tot_price = models.IntegerField()

class Taxi(models.Model):
  company = models.CharField(max_length=32)
  car_number = models.CharField(max_length=15)
  phone_number = models.CharField(max_length=15)

class TransportationReservation(models.Model):
  taxi = models.ForeignKey(
    Taxi,
    on_delete= models.SET_NULL,
    related_name = 'taxi',
    null = True
  )
  reservation_name = models.CharField(max_length=64)
  reservation_time = models.DateTimeField(auto_now_add=True)
  status = models.IntegerField()  #temporary
  head_count = models.IntegerField() #temporary
  tot_price = models.IntegerField() 

class HalfDayOff(Plan):
  transportation= models.ForeignKey(
    TransportationReservation,
    on_delete = models.SET_NULL,
    related_name = 'transportation',
    null = True
  ) #temporary
  activity = models.ManyToManyField(
    PlaceReservation,
    related_name = 'plans'
  )
  dinner = models.ForeignKey(
    PlaceReservation,
    on_delete = models.SET_NULL,
    related_name = 'dinner',
    null = True
  )
  scenary = models.ManyToManyField(
    PlaceReservation,
    related_name = 'scenary'
  )

class HashTag(models.Model):
  hashtag_name = models.CharField(max_length=32)
  feature = models.ForeignKey(
    Feature,
    on_delete = models.SET_NULL,
    related_name = 'feature',
    null = True
  )
  suggestion = models.ManyToManyField(
    Suggestion,
    related_name = 'suggestion'
  )
  instagram = models.ManyToManyField(
    Instagram,
    related_name = 'instagram'
  )
  count = models.IntegerField()

class Instagram(models.Model):
  latitude = models.FloatField()
  longitude = models.FloatField()
  type = models.CharField() #temporary
  # image_urls = models.FilePathField() #temprorary
  hashtags = models.ManyToManyField(
    HashTag,
    related_name = 'hashtags'
  )
  status = models.IntegerField()  #temporary

class Suggestion(models.Model):
  user = models.ForeignKey(
    User,
    on_delete = models.CASCADE,
    related_name = 'suggestion_user'
  )
  place = models.ForeignKey(
    Place,
    on_delete = models.CASCADE,  #temporary
    related_name = 'place'
  )
  hashtag = models.ManyToManyField(
    HashTag,
    related_name='hashtag'
  )
  content = models.CharField(max_length=32)
  status = models.IntegerField()  #temporary

class Personality(models.Model):
  type = models.CharField() #temporary

class Preference(models.Model):
  personality = models.ForeignKey(
    Personality,
    on_delete = models.SET_NULL,
    null = True
  )
  feature = models.ForeignKey(
    Features,
    on_delete = models.SET_NULL,
    null = True
  )
  weight = models.FloatField()