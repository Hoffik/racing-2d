from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Race(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Car(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to="cars")
    speed = models.IntegerField(default=0.5)
    traction = models.IntegerField(default=0.5)
    races = models.ManyToManyField(
        Race,
        related_name='cars',
    )

    def __str__(self):
        return self.name


class Terrain(models.Model):
    name = models.CharField(max_length=50)
    road_slipperiness = models.IntegerField(default=0.1)
    offroad_slipperiness = models.IntegerField(default=0.6)

    def __str__(self):
        return self.name


class Track(models.Model):
    name = models.CharField(max_length=50)
    races = models.ManyToManyField(
        Race,
        related_name='tracks'
    )
    terrain = models.ForeignKey(
        Terrain,
        related_name='tracks',
        on_delete=models.PROTECT
    )
    visible_layer = models.ImageField(upload_to="tracks")
    support_layer = models.ImageField(upload_to="tracks")
    check_point_count = models.IntegerField(default=0)
    starting_position_x = models.IntegerField(default=0)
    starting_position_y = models.IntegerField(default=0)
    starting_azimuth = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Result(models.Model):
    track = models.ForeignKey(
        Track,
        related_name='results',
        on_delete=models.CASCADE
    )
    time = models.DurationField()
    user = models.ForeignKey(
        User,
        related_name='results',
        on_delete=models.SET_NULL,
        null=True
    )
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('track', 'time', )    

    def __str__(self):
        return str(self.track) + ": " + self.time + " (" + str(self.user) + ")"