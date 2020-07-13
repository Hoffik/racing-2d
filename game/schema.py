from graphene_django import DjangoObjectType
import graphene

from .models import User, Race, Car, Terrain, Track, Result

class UserType(DjangoObjectType):
    class Meta:
        model = User

class RaceType(DjangoObjectType):
    class Meta:
        model = Race

class CarType(DjangoObjectType):
    class Meta:
        model = Car

class TerrainType(DjangoObjectType):
    class Meta:
        model = Terrain

class TrackType(DjangoObjectType):
    class Meta:
        model = Track

class ResultType(DjangoObjectType):
    class Meta:
        model = Result


class Query(object):
    all_users = graphene.List(UserType)
    all_races = graphene.List(RaceType)
    all_cars = graphene.List(CarType)
    all_terrains = graphene.List(TerrainType)
    all_tracks = graphene.List(TrackType)
    all_results = graphene.List(ResultType)

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_all_races(self, info, **kwargs):
        return Race.objects.all()

    def resolve_all_cars(self, info, **kwargs):
        return Car.objects.all()

    def resolve_all_terrains(self, info, **kwargs):
        return Terrain.objects.all()

    def resolve_all_tracks(self, info, **kwargs):
        return Track.objects.all()

    def resolve_all_results(self, info, **kwargs):
        return Result.objects.all()