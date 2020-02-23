from .serializers import CommentSerializer
from rest_framework import viewsets
from .models import Comment
from rest_framework_extensions.mixins import NestedViewSetMixin

class CommentViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
