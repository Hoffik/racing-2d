from django.urls import path
from django.conf.urls import include

from .views import Race

app_name = 'game'

# App views
app_urls = [
    path('', Race.as_view(), name='race'),
]

# Views index
urlpatterns = [
    path('', include(app_urls)),
]