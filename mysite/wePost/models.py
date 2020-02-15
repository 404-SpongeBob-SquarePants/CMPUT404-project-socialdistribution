from django.db import models
import uuid

CONTENT_TYPE_CHOICES = (
    ('text/markdown', 'text/markdown'),
    ('text/plain', 'text/plain'),
    ('application/base64', 'application/base64'),
    ('image/png;base64', 'image/png;base64'),
    ('image/jpeg;base64', 'image/jpeg;base64'),
)
# Create your models here.
class Author(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    bio = models.TextField()
    host = models.URLField()
    firstName = models.CharField(max_length=256)
    lastName = models.CharField(max_length=256)
    displayName = models.CharField(max_length=256)
    url = models.URLField()
    github = models.URLField()

class Post(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=256)
    source = models.URLField()
    origin = models.URLField()
    description = models.CharField(max_length=512)
    contentType = models.CharField(max_length=32, choices=CONTENT_TYPE_CHOICES)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    count = models.PositiveIntegerField()
    size = models.PositiveIntegerField()
    published = models.DateTimeField(auto_now_add=True)

    VISIBILITY_CHOICES =(
        ('PUBLIC', 'PUBLIC'),
        ('FOAF', 'FOAF'),
        ('FRIENDS', 'FRIENDS'),
        ('PRIVATE', 'PRIVATE'),
        ('SERVERONLY', 'SERVERONLY'),
    )
    visibility = models.CharField(max_length=16, choices=VISIBILITY_CHOICES)
    unlisted = models.BooleanField(default=False)

class Comment(models.Model): 
 
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    podstId = models.ForeignKey(Post, on_delete=models.CASCADE)        
    author = models.ForeignKey(Author, on_delete=models.CASCADE)                                        
    comment = models.CharField(max_length=400)
    contentType = models.CharField(max_length=32, choices=CONTENT_TYPE_CHOICES)
    published = models.DateTimeField(auto_now_add=True, blank=True)
