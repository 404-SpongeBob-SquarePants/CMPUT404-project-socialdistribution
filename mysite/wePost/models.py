from django.db import models
import uuid

# Create your models here.
class Author(models.Model):

    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    email = models.EmailField(unique = True)
    host = models.URLField()
    displayName = models.CharField(max_length = 256)
    url = models.URLField()
    github = models.URLField()

class Post(models.Model):

    VISIBILITYCHOICES =(
        ('PUBLIC', 'PUBLIC'),
        ('FOAF', 'FOAF'),
        ('FRIENDS', 'FRIENDS'),
        ('PRIVATE', 'PRIVATE'),
        ('SERVERONLY', 'SERVERONLY'),
    )

    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    title = models.CharField(max_length = 256)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete = models.CASCADE)
    count = models.PositiveIntegerField()
    published = models.DateTimeField(auto_now_add = True)
    visibility = models.CharField(max_length = 16, choices = VISIBILITYCHOICES, default = 'PUBLIC')
    visibleTo = models.TextField(null = True, blank = True)
    unlisted = models.BooleanField(default = False)

class Comment(models.Model): 
 
    id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)    
    post = models.ForeignKey(Post, on_delete = models.CASCADE)        
    author = models.ForeignKey(Author, on_delete = models.CASCADE)                                        
    comment = models.CharField(max_length = 400)
    published = models.DateTimeField(auto_now_add = True, blank = True)
