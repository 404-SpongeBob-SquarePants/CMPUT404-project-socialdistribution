# Generated by Django 3.0.3 on 2020-04-06 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20200406_0019'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='github_username',
        ),
        migrations.AddField(
            model_name='user',
            name='github',
            field=models.URLField(blank=True, null=True),
        ),
    ]
