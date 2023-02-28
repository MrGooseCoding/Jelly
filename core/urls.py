from django.urls import path, include
from django.views.generic import TemplateView

from core.views import *

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('@app/', app.as_view()),
    path('api/', include('API.urls')),
    path('', homepage)
]
