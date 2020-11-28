# Generated by Django 3.1.2 on 2020-11-27 19:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_auto_20201114_0639'),
        ('plan', '0006_auto_20201114_1131'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preference',
            name='personality',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='preference_personality', to='account.personalitytype'),
        ),
    ]
