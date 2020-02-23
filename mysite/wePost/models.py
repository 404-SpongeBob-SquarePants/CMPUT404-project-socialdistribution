from django.db import models
import uuid

DEFAULTHOST = "http://127.0.0.1:3000/"
CONTENTTYPE = (
    ("text/plain", "plain text"),
    ("text/markdown", "markdown text"),
)

# Create your models here.
class Admin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    displayName = models.CharField(max_length=256)

    def __str__(self):
        return self.displayName


class Author(models.Model):
    REGISTERSTATUS = (
        ("U", "Unprocessed"),
        ("A", "Allowed"),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    host = models.URLField()
    displayName = models.CharField(max_length=256)
    url = models.URLField()
    github = models.URLField()
    bio = models.CharField(max_length=2048, blank=True)
    registerStatus = models.CharField(max_length=1, choices=REGISTERSTATUS, default="U")

    def __str__(self):
        return self.displayName


class Post(models.Model):
    VISIBILITYCHOICES = (
        ("PUBLIC", "PUBLIC"),
        ("FOAF", "FOAF"),
        ("FRIENDS", "FRIENDS"),
        ("PRIVATE", "PRIVATE"),
        ("SERVERONLY", "SERVERONLY"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.URLField(default=DEFAULTHOST)
    origin = models.URLField(default=DEFAULTHOST)
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=256, blank=True)
    content = models.TextField()
    contentType = models.CharField(
        max_length=16, choices=CONTENTTYPE, default="text/markdown"
    )
    categories = models.TextField(blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="posts")
    count = models.PositiveIntegerField()
    published = models.DateTimeField(auto_now_add=True)
    visibility = models.CharField(
        max_length=16, choices=VISIBILITYCHOICES, default="PUBLIC"
    )
    visibleTo = models.TextField(null=True, blank=True)
    unlisted = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="comments"
    )
    comment = models.CharField(max_length=400)
    contentType = models.CharField(
        max_length=16, choices=CONTENTTYPE, default="text/markdown"
    )
    published = models.DateTimeField(auto_now_add=True, blank=True)


class Friend(models.Model):
    class Meta:
        unique_together = (("f1Id", "f2Id"),)

    FRIENDSTATUS = (("U", "Unprocessed"), ("A", "Accepted"))
    date = models.DateField(auto_now_add=True)
    f1Id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="f1Ids")
    f2Id = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="f2Ids")
    status = models.CharField(max_length=1, choices=FRIENDSTATUS, default="U")


class Node(models.Model):
    host = models.CharField(max_length=256, primary_key=True)
    port = models.IntegerField(blank=True, default=3000)

    def __str__(self):
        return f"{self.host}:{self.port}"

