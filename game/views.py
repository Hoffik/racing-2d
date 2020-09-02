from django.views.generic import TemplateView

from rest_framework import viewsets
from rest_framework import permissions

from .models import User, Race, Car, Terrain, Track, Result
from .serializers import UserSerializer, RaceSerializer, CarSerializer, TerrainSerializer, TrackSerializer, ResultSerializer


# App views
class Game(TemplateView):
    template_name = "race.html"

class Test(TemplateView):
    template_name = "base.html"

# Rest API views
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (permissions.IsAuthenticatedOrReadOnly)
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )


class RaceViewSet(viewsets.ModelViewSet):
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )
    

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )


class TerrainViewSet(viewsets.ModelViewSet):
    queryset = Terrain.objects.all()
    serializer_class = TerrainSerializer
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = (permissions.DjangoModelPermissionsOrAnonReadOnly, )


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, )