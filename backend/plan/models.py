import datetime

from django.utils import timezone
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from account.models import User, PersonalityType


class Plan(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='plan_user'
    )
    head_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    ended_at = models.DateTimeField(null=True)
    feedback = models.FloatField(null=True)  # temporary

    @classmethod
    def get_today_plan(cls, user):
        today_min = datetime.datetime.combine(datetime.datetime.today(), datetime.time.min)
        today_min = timezone.make_aware(today_min)
        today_max = datetime.datetime.combine(datetime.datetime.today(), datetime.time.max)
        today_max = timezone.make_aware(today_max)
        plan = cls.objects.filter(user=user, created_at__range=(today_min, today_max)).first()
        return plan


class Features(models.Model):
    feature_name = models.CharField(max_length=32)
    status = models.IntegerField()


class Place(models.Model):
    STATUS = (
        (1, 'suggested'),
        (2, 'verified'),
        (3, 'denied'),
    )

    latitude = models.FloatField()
    longitude = models.FloatField()
    roadAddress = models.TextField()
    extraAddress = models.TextField()
    type = models.CharField(max_length=64)
    features = models.ManyToManyField(
        Features,
        related_name='place_feature',
        blank=True
    )  # temporary
    name = models.CharField(max_length=64, null=True)
    image_key = models.TextField()
    status = models.IntegerField(choices=STATUS)
    avg_score = models.FloatField()


class Review(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='review_user'
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name='review_place'
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.CASCADE,
        related_name='review_plan',
        null=True
    )
    score = models.FloatField()
    content = models.TextField()

    def asdict(self):
        return {'id': self.id, 'plan': self.plan_id, 'place': self.place_id, 'score': self.score,
                'content': self.content}


class PlaceReservation(models.Model):
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,
        related_name="reservation_place"
    )
    reservation_name = models.CharField(max_length=64)
    reservation_time = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField()  # temporary
    head_count = models.IntegerField()  # temporary
    tot_price = models.IntegerField()


class Taxi(models.Model):
    company = models.CharField(max_length=32)
    car_number = models.CharField(max_length=15)
    phone_number = PhoneNumberField()
    reservable = models.BooleanField(default=False)  # temporary

    @classmethod
    def get_reservable_taxi(cls):
        taxi = cls.objects.filter(reservable=True).first()
        if taxi is None:
            taxi = cls(company='개인 택시', car_number='23우 2372',
                       phone_number='010-1111-1111', reservable=True)
            taxi.save()
        return taxi


class TransportationReservation(models.Model):
    STATUS = (
        (1, 'not_reserved'),
        (2, 'reserved'),
        (3, 'finish'),
    )

    taxi = models.ForeignKey(
        Taxi,
        on_delete=models.SET_NULL,
        related_name='transport_taxi',
        null=True
    )

    status = models.IntegerField(choices=STATUS)  # temporary
    reservation_name = models.CharField(max_length=64)
    reservation_time = models.DateTimeField(auto_now_add=True)
    head_count = models.IntegerField()  # temporary
    tot_price = models.IntegerField()


class HalfDayOffReservation(models.Model):
    plan = models.OneToOneField(
        Plan,
        on_delete=models.CASCADE,
        related_name='reservation',
        primary_key=True,
    )  # temporary
    transportation = models.ForeignKey(
        TransportationReservation,
        on_delete=models.SET_NULL,
        related_name='halfdayoff_trans',
        null=True
    )  # temporary
    activity = models.ForeignKey(
        PlaceReservation,
        on_delete=models.SET_NULL,
        related_name='halfdayoff_activity',
        null=True
    )
    dinner = models.ForeignKey(
        PlaceReservation,
        on_delete=models.SET_NULL,
        related_name='halfdayoff_dinner',
        null=True
    )
    scenary = models.ForeignKey(
        PlaceReservation,
        on_delete=models.SET_NULL,
        related_name='halfdayoff_scenary',
        null=True
    )


class HashTag(models.Model):
    hashtag_name = models.CharField(max_length=32)
    feature = models.ForeignKey(
        Features,
        on_delete=models.SET_NULL,
        related_name='hashtag_feature',
        null=True
    )


class Instagram(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    type = models.IntegerField()  # temporary
    # image_urls = models.FilePathField() #temprorary
    hashtags = models.ManyToManyField(
        HashTag,
        related_name='instagram_hashtag'
    )
    status = models.IntegerField()  # temporary


class Preference(models.Model):
    personality = models.ForeignKey(
        PersonalityType,
        on_delete=models.SET_NULL,
        related_name='preference_personality',
        null=True
    )
    feature = models.ForeignKey(
        Features,
        on_delete=models.SET_NULL,
        related_name='preference_feature',
        null=True
    )
    weight = models.FloatField()
