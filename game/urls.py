from django.urls import include, path

from rest_framework import routers

from .views import Game
from .views import UserViewSet, RaceViewSet, CarViewSet, TerrainViewSet, TrackViewSet, ResultViewSet

app_name = 'game'

# App urls
app_urls = [
    path('', Game.as_view(), name='race'),
]

# REST API urls
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'races', RaceViewSet)
router.register(r'cars', CarViewSet)
router.register(r'terrains', TerrainViewSet)
router.register(r'tracks', TrackViewSet)
router.register(r'results', ResultViewSet)

# Views index
urlpatterns = [
    path('', include(app_urls)),            # App urls
    path('rest/', include(router.urls)),    # REST API urls
]