from rest_framework import serializers
from .models import *
from rest_framework.pagination import PageNumberPagination

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'


class DefaultResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'size'
    max_page_size = 50