from rest_framework import serializers
from .models import User, Race, Car, Terrain, Track, Result


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff', 'email', 'email_confirmed', 'results', )


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ('id', 'name', 'cars', 'tracks', )


class CarSerializer(serializers.ModelSerializer):
    height = serializers.ReadOnlyField(source='image.height')
    width = serializers.ReadOnlyField(source='image.width')

    class Meta:
        model = Car
        fields = ('id', 'name', 'image', 'height', 'width', 'speed', 'traction', 'races', )

    def get_neco(self, obj):
        return 'neco'

class TerrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terrain
        fields = ('id', 'name', 'road_slipperiness', 'offroad_slipperiness', 'tracks', )


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('id', 'name', 'terrain', 'visible_layer', 'support_layer', 'check_point_count', 'starting_position_x', 'starting_position_y', 'starting_azimuth', 'races', 'results', )


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ('id', 'track', 'time', 'user', 'created', )