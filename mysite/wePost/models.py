from django.db import models
import uuid

# Create your models here.
class Admin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    displayName = models.CharField(max_length=256)


class Author(models.Model):
    REGISTERSTATUS = (
        ("U", "Unprocessed"),
        ("A", "Allowed"),
        ("R", "Rejected"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    host = models.URLField()
    displayName = models.CharField(max_length=256)
    url = models.URLField()
    github = models.URLField()
    active = models.BooleanField(default=False)
    bio = models.CharField(max_length=2048, blank=True)
    registerStatus = models.CharField(max_length=1, choices=REGISTERSTATUS, default="U")


class Post(models.Model):
    VISIBILITYCHOICES = (
        ("PUBLIC", "PUBLIC"),
        ("FOAF", "FOAF"),
        ("FRIENDS", "FRIENDS"),
        ("PRIVATE", "PRIVATE"),
        ("SERVERONLY", "SERVERONLY"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=256)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="posts")
    count = models.PositiveIntegerField()
    published = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(
        max_length=16, choices=VISIBILITYCHOICES, default="PUBLIC"
    )
    visibleTo = models.TextField(null=True, blank=True)
    unlisted = models.BooleanField(default=False)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="comments"
    )
    comment = models.CharField(max_length=400)
    published = models.DateTimeField(auto_now_add=True, blank=True)


class Friend(models.Model):
    class Meta:
        unique_together = (("f1Id", "f2Id"),)

    FRIENDSTATUS = (
        ("U", "Unprocessed"),
        ("A", "Accepted"),
        ("R", "Rejected"),
    )
    date = models.DateField(auto_now_add=True)
    f1Id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="f1Ids")
    f2Id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="f2Ids")
    status = models.CharField(max_length=1, choices=FRIENDSTATUS, default="U")


class Node(models.Model):
    host = models.CharField(max_length=256, primary_key=True)
    port = models.IntegerField(null=True)

