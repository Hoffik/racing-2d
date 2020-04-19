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
    speed = models.DecimalField(default=0.5, max_digits=2, decimal_places=1)
    traction = models.DecimalField(default=0.5, max_digits=2, decimal_places=1)
    races = models.ManyToManyField(
        Race,
        related_name='cars',
    )

    def __str__(self):
        return self.name


class Terrain(models.Model):
    name = models.CharField(max_length=50)
    road_slipperiness = models.DecimalField(default=0.1, max_digits=2, decimal_places=1)
    offroad_slipperiness = models.DecimalField(default=0.6, max_digits=2, decimal_places=1)

    def __str__(self):
        return self.name


class Track(models.Model):
    name = models.CharField(max_length=50)
    terrain = models.ForeignKey(
        Terrain,
        related_name='tracks',
        on_delete=models.PROTECT,
        help_text="Terrain type used for getting road and off-road slipperines."
    )
    visible_layer = models.ImageField(upload_to="tracks", help_text="Track image visible to players (jpg).")
    support_layer = models.ImageField(upload_to="tracks", help_text="Support track image used for calculating collisions, off-road driving, check-points etc. (png).")
    check_point_count = models.IntegerField(default=0, help_text="Number of check points on track (not counting starting/finnish line).")
    starting_position_x = models.IntegerField(default=0, help_text="Positioning of track from left window edge so that car is on starting line (px).")
    starting_position_y = models.IntegerField(default=0, help_text="Positioning of track from top window edge so that car is on starting line (px).")
    starting_azimuth = models.IntegerField(default=0, help_text="Orientation of a car on starting line (°).")
    races = models.ManyToManyField(
        Race,
        related_name='tracks',
        help_text="Race types this track is part of."
    )

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