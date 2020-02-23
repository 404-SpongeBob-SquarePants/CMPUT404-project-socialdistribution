from .serializers import AdminSerializer
from rest_framework import viewsets
from .models import Admin
from rest_framework_extensions.mixins import NestedViewSetMixin

class AdminViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
