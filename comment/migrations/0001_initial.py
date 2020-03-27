# Generated by Django 3.0.3 on 2020-03-26 13:47

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('comment', models.CharField(max_length=400)),
                ('contentType', models.CharField(choices=[('text/plain', 'plain text'), ('text/markdown', 'markdown text')], default='text/markdown', max_length=16)),
                ('published', models.DateTimeField()),
            ],
        ),
    ]
