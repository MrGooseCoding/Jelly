from django.urls import re_path
from WS import consumers

websocket_urlpatterns=[
    re_path(r'ws/(?P<token>[0-9a-zA-Z._]+)', consumers.Consumer.as_asgi())
] 
