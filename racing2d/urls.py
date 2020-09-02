"""racing2d URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt    # remove csrf_exempt for production !!!

from graphene_django.views import GraphQLView
# from racing2d.schema import schema

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql', csrf_exempt(GraphQLView.as_view(graphiql=True))),   # remove csrf_exempt for production !!!
    path('auth/', include('rest_framework.urls')),  # Basic DRF authentication
    path('', include('game.urls')),
]
