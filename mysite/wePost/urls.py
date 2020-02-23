from rest_framework import routers
from .serializers import *
from .author_views import AuthorViewSet
from .admin_views import AdminViewSet
from .post_views import PostViewSet
from .comment_views import CommentViewSet
from .node_views import NodeViewSet
from django.conf.urls import url
from django.urls import path,include
from rest_framework_extensions.routers import NestedRouterMixin

class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass

router = NestedDefaultRouter()
admin_router = router.register('admins',AdminViewSet)
author_router = router.register('author',AuthorViewSet)
author_router.register(
    'posts',PostViewSet,
    basename='author-posts',
    parents_query_lookups=['author']
).register(
    'comments',CommentViewSet,
    basename='atuhor-posts-comments',
    parents_query_lookups=['post__author','post']
)
post_router = router.register('posts',PostViewSet)
post_router.register(
    'comments',CommentViewSet,
    basename='posts-comments',
    parents_query_lookups=['post']
)

urlpatterns = [
    url('', include(router.urls))
]
