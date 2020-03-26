# Generated by Django 3.0.3 on 2020-03-26 13:47

from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=256)),
                ('source', models.URLField(default='https://spongebook.herokuapp.com/')),
                ('origin', models.URLField(default='https://spongebook.herokuapp.com/')),
                ('description', models.CharField(blank=True, default='', max_length=256)),
                ('content', models.TextField()),
                ('contentType', models.CharField(choices=[('text/plain', 'plain text'), ('text/markdown', 'markdown text'), ('image/png;base64', 'png image encoding in base64'), ('image/jpeg;base64', 'jpeg image encoding in base64'), ('application/base64', 'application ending in base64')], default='text/markdown', max_length=32)),
                ('categoriesStr', models.TextField(default='[]')),
                ('published', models.DateTimeField(default=django.utils.timezone.now)),
                ('visibility', models.CharField(choices=[('PUBLIC', 'PUBLIC: visible to PUBLIC'), ('FOAF', 'FOAF: visible to friends of a friend'), ('FRIENDS', 'FRIENDS: visiable to friends'), ('PRIVATE', 'PRIVATE: visiable to users listed in visiableTo field'), ('SERVERONLY', 'SERVERONLY: visiable to a certain server')], default='PUBLIC', max_length=16)),
                ('visibleToStr', models.TextField(default='[]')),
                ('unlisted', models.BooleanField(default=False)),
                ('isImage', models.BooleanField(default=False)),
                ('imagePostIdsStr', models.TextField(default='[]')),
                ('textPostId', models.UUIDField(blank=True, null=True)),
            ],
        ),
    ]
