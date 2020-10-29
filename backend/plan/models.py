from datetime import datetime

from django.db import models
from django.contrib.auth.models import User as DjangoUser


class User(DjangoUser):
    phone_number = models.CharField(max_length=15)

    def __init__(self, username, password, phone_number):
        super().__init__(username, password)
        self.phone_number = phone_number
