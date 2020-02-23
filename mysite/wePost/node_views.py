from .serializers import NodeSerializer
from rest_framework import viewsets
from .models import Node
from rest_framework_extensions.mixins import NestedViewSetMixin

class NodeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Node.objects.all()
    serializer_class = NodeSerializer
