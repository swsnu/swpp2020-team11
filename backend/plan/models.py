from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from account.models import User, Personality

class Plan(models.Model):
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = 'plan_user'
    )
    head_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    ended_at = models.DateTimeField(null=True)
    feedback = models.FloatField(null=True) #temporary

class Features(models.Model):
    feature_name = models.CharField(max_length=32)
    status = models.IntegerField()

class Place(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.CharField(max_length=64)
    features = models.ManyToManyField(
        Features,
        related_name = 'place_feature',
        blank=True
    ) #temporary
    name = models.CharField(max_length=64, null = True)
    image_urls = models.URLField(null = True)
    status = models.IntegerField() #temporary
    avg_score = models.FloatField()

class Review(models.Model):
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = 'review_user'
    )
    place = models.ForeignKey(
        Place,
        on_delete = models.CASCADE,
        related_name = 'review_place'
    )
    plan = models.ForeignKey(
        Plan,
        on_delete = models.CASCADE,
        related_name = 'review_plan',
        null=True
    )
    score = models.FloatField()
    content = models.TextField()

    def asdict(self):
        return {'id':self.id, 'plan':self.plan_id, 'place':self.place_id, 'score':self.score, 'content':self.content}

class PlaceReservation(models.Model):
    place = models.ForeignKey(
        Place,
        on_delete = models.CASCADE,
        related_name = "reservation_place"
    )
    reservation_name = models.CharField(max_length=64)
    reservation_time = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField() #temporary
    head_count = models.IntegerField() #temporary
    tot_price = models.IntegerField()

class Taxi(models.Model):
    company = models.CharField(max_length=32)
    car_number = models.CharField(max_length=15)
    phone_number = PhoneNumberField()

class TransportationReservation(models.Model):
    taxi = models.ForeignKey(
        Taxi,
        on_delete= models.SET_NULL,
        related_name = 'transport_taxi',
        null = True
    )
    reservation_name = models.CharField(max_length=64)
    reservation_time = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField()  #temporary
    head_count = models.IntegerField() #temporary
    tot_price = models.IntegerField()

class HalfDayOff(models.Model):
    transportation= models.ForeignKey(
        TransportationReservation,
        on_delete = models.SET_NULL,
        related_name = 'halfdayoff_trans',
        null = True
    ) #temporary
    activity = models.ForeignKey(
        PlaceReservation,
        on_delete = models.SET_NULL,
        related_name = 'halfdayoff_activity',
        null = True
    )
    dinner = models.ForeignKey(
        PlaceReservation,
        on_delete = models.SET_NULL,
        related_name = 'halfdayoff_dinner',
        null = True
    )
    scenary = models.ForeignKey(
        PlaceReservation,
        on_delete = models.SET_NULL,
        related_name = 'halfdayoff_scenary',
        null = True
    )

class HashTag(models.Model):
    hashtag_name = models.CharField(max_length=32)
    feature = models.ForeignKey(
        Features,
        on_delete = models.SET_NULL,
        related_name = 'hashtag_feature',
        null = True
    )
    count = models.IntegerField()

class Instagram(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.IntegerField() #temporary
    # image_urls = models.FilePathField() #temprorary
    hashtags = models.ManyToManyField(
        HashTag,
        related_name = 'instagram_hashtag'
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
        related_name = 'suggestion_place'
    )
    hashtag = models.ManyToManyField(
        HashTag,
        related_name='suggestion_hashtag'
    )
    content = models.CharField(max_length=32)
    status = models.IntegerField()  #temporary


class Preference(models.Model):
    personality = models.ForeignKey(
        Personality,
        on_delete = models.SET_NULL,
        related_name='preference_personality',
        null = True
    )
    feature = models.ForeignKey(
        Features,
        on_delete = models.SET_NULL,
        related_name='preference_feature',
        null = True
    )
    weight = models.FloatField()
