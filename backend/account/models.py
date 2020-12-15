from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from phonenumber_field.modelfields import PhoneNumberField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, nickname, password, phone_number=""):
        if not email:
            raise ValueError('must have user email')
        user = self.model(
            email=self.normalize_email(email),
            nickname=nickname,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nickname, password):
        user = self.create_user(
            email=self.normalize_email(email),
            nickname=nickname,
            phone_number='',
            password=password
        )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    objects = UserManager()

    email = models.EmailField(
        max_length=255,
        unique=True,
    )
    nickname = models.CharField(
        max_length=20,
        null=False,
    )
    phone_number = PhoneNumberField(blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']

    def as_dict(self):
        return {'id': self.id, 'email': self.email, 'is_loggedIn': self.is_authenticated}


class PersonalityType(models.Model):
    FIVE_FACTOR = (
        ('O', 'openness'),
        ('C', 'conscientiousness'),
        ('E', 'extraversion'),
        ('A', 'agreeableness'),
        ('N', 'neuroticism'),
    )
    classification_type = models.CharField(max_length=30)
    personality_type = models.CharField(max_length=2, choices=FIVE_FACTOR)


class PersonalityTestQuestion(models.Model):
    question = models.TextField()
    type = models.ForeignKey(
        PersonalityType,
        on_delete=models.CASCADE,
        related_name='questions',
        null=True,
    )
    weight = models.FloatField(null=True)


class Personality(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='personality',
    )
    score = models.FloatField()
    type = models.ForeignKey(
        PersonalityType,
        on_delete=models.CASCADE,
        related_name='personalities'
    )
