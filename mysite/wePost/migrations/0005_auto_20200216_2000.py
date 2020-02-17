# Generated by Django 3.0.3 on 2020-02-17 03:00

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('wePost', '0004_author_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254)),
                ('displayName', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('host', models.CharField(max_length=256, primary_key=True, serialize=False)),
                ('port', models.IntegerField(null=True)),
            ],
        ),
        migrations.AddField(
            model_name='author',
            name='bio',
            field=models.CharField(blank=True, max_length=2048),
        ),
        migrations.AddField(
            model_name='author',
            name='registerStatus',
            field=models.CharField(choices=[('U', 'Unprocessed'), ('A', 'Allowed'), ('R', 'Rejected')], default='U', max_length=1),
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='wePost.Author'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='wePost.Post'),
        ),
        migrations.AlterField(
            model_name='post',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='wePost.Author'),
        ),
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('status', models.CharField(choices=[('U', 'Unprocessed'), ('A', 'Accepted'), ('R', 'Rejected')], default='U', max_length=1)),
                ('f1Id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='f1Ids', to='wePost.Author')),
                ('f2Id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='f2Ids', to='wePost.Author')),
            ],
            options={
                'unique_together': {('f1Id', 'f2Id')},
            },
        ),
    ]