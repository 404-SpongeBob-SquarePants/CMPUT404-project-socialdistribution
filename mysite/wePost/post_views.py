from .serializers import PostSerializer
from rest_framework import viewsets
from .models import Post
from rest_framework_extensions.mixins import NestedViewSetMixin

class PostViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
