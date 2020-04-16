from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Race, Car, Terrain, Track, Result

admin.site.register(User, UserAdmin)
admin.site.register(Race)
admin.site.register(Car)
admin.site.register(Terrain)
admin.site.register(Track)

class ResultAdmin(admin.ModelAdmin):
    readonly_fields = ('track', 'time', 'user', 'created',)

admin.site.register(Result, ResultAdmin)