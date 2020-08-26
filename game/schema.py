from graphene_django import DjangoObjectType
import graphene

from .models import User, Race, Car, Terrain, Track, Result

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = "__all__"
        # List or exclude fields that should/shouldn't be visible
        # fields = ("id", "username")
        # exclude = ("firstName", "lastName")

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
    user = graphene.Field(UserType, id=graphene.Int(), username=graphene.String())
    all_users = graphene.List(UserType)
    race = graphene.Field(RaceType, id=graphene.Int(), name=graphene.String())
    all_races = graphene.List(RaceType)
    car = graphene.Field(CarType, id=graphene.Int(), name=graphene.String())
    all_cars = graphene.List(CarType)
    terrain = graphene.Field(TerrainType, id=graphene.Int(), name=graphene.String())
    all_terrains = graphene.List(TerrainType)
    track = graphene.Field(TerrainType, id=graphene.Int(), name=graphene.String())
    all_tracks = graphene.List(TrackType)
    result = graphene.Field(TerrainType, id=graphene.Int())
    all_results = graphene.List(ResultType)

    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')
        username = kwargs.get('username')
        if id is not None:
            return User.objects.get(pk=id)
        if username is not None:
            return User.objects.get(username=username)
        return None

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_race(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Race.objects.get(pk=id)
        if name is not None:
            return Race.objects.get(name=name)
        return None

    def resolve_all_races(self, info, **kwargs):
        return Race.objects.all()

    def resolve_car(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Car.objects.get(pk=id)
        if name is not None:
            return Car.objects.get(name=name)
        return None

    def resolve_all_cars(self, info, **kwargs):
        return Car.objects.all()

    def resolve_terrain(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Terrain.objects.get(pk=id)
        if name is not None:
            return Terrain.objects.get(name=name)
        return None

    def resolve_all_terrains(self, info, **kwargs):
        return Terrain.objects.all()

    def resolve_track(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Track.objects.get(pk=id)
        if name is not None:
            return Track.objects.get(name=name)
        return None

    def resolve_all_tracks(self, info, **kwargs):
        return Track.objects.all()

    def resolve_result(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Result.objects.get(pk=id)
        return None

    def resolve_all_results(self, info, **kwargs):
        return Result.objects.all()