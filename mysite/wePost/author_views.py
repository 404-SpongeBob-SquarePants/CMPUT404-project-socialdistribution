from .serializers import AuthorSerializer
from rest_framework import viewsets
from .models import Author
from rest_framework_extensions.mixins import NestedViewSetMixin

class AuthorViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer