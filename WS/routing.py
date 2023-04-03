from django.urls import re_path
from WS import consumers

websocket_urlpatterns=[
    re_path(r'ws/(?P<chat_id>[0-9]+)/(?P<token>[0-9a-zA-Z._]+)', consumers.ChatConsumer.as_asgi())
] 
