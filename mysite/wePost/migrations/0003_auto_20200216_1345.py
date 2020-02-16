# Generated by Django 3.0.2 on 2020-02-16 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wePost', '0002_auto_20200216_1205'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='podstId',
            new_name='post',
        ),
        migrations.RemoveField(
            model_name='author',
            name='bio',
        ),
        migrations.RemoveField(
            model_name='author',
            name='firstName',
        ),
        migrations.RemoveField(
            model_name='author',
            name='lastName',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='contentType',
        ),
        migrations.RemoveField(
            model_name='post',
            name='contentType',
        ),
        migrations.RemoveField(
            model_name='post',
            name='description',
        ),
        migrations.RemoveField(
            model_name='post',
            name='origin',
        ),
        migrations.RemoveField(
            model_name='post',
            name='size',
        ),
        migrations.RemoveField(
            model_name='post',
            name='source',
        ),
        migrations.AddField(
            model_name='post',
            name='visibleTo',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='visibility',
            field=models.CharField(choices=[('PUBLIC', 'PUBLIC'), ('FOAF', 'FOAF'), ('FRIENDS', 'FRIENDS'), ('PRIVATE', 'PRIVATE'), ('SERVERONLY', 'SERVERONLY')], default='PUBLIC', max_length=16),
        ),
    ]
