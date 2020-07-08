from graphene_django import DjangoObjectType
import graphene

from .models import User, Race, Car, Terrain, Track, Result

class RaceType(DjangoObjectType):
    class Meta:
        model = Race


class CarType(DjangoObjectType):
    class Meta:
        model = Car


class Query(object):
    all_races = graphene.List(RaceType)
    all_cars = graphene.List(CarType)

    def resolve_all_races(self, info, **kwargs):
        return Race.objects.all()

    def resolve_all_cars(self, info, **kwargs):
        return Car.objects.all()