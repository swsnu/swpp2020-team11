from django.db import models
from plan.models import Place, HashTag
from account.models import User


class Suggestion(models.Model):
    STATUS = (
        (1, 'waiting'),
        (2, 'denied'),
        (3, 'approved'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='suggestion_user'
    )
    place = models.ForeignKey(
        Place,
        on_delete=models.CASCADE,  # temporary
        related_name='suggestion_place'
    )
    hashtag = models.ManyToManyField(
        HashTag,
        related_name='suggestion_hashtag'
    )
    content = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS)  # temporary
