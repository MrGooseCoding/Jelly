import json
from typing import OrderedDict
from rest_framework.authtoken.models import Token
from core.models import *
from django.contrib.auth.models import User
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from serializers import MessageSerializer

class Consumer(WebsocketConsumer):
    def connect(self):

        token = self.scope['url_route']['kwargs']['token']
        user = Token.objects.get(key=token).user
        self.account = Account.objects.get(user__username = user.username)
        self.room_group_names=[]

        self.accept()

        for i in self.account.chat_set.all():
            room_group_name = 'chat_'+str(i.id)

            async_to_sync(self.channel_layer.group_add)(
                room_group_name,
                self.channel_name
            )
            self.room_group_names.append(room_group_name)
        
        self.send(text_data= json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected'
        }))

    def receive(self, text_data):
        print(self.account, ': ', text_data)
        text_data_json = json.loads(text_data)
        chat_id = text_data_json['chat_id']
        chat = Chat.objects.get(pk=chat_id)
        
        if text_data_json['type'] == 'recent_messages':
            if self.account in chat.members.all():
                recent_messages = Message.objects.filter(chat__id = chat_id).order_by('-pub_date')[:10] 
                recent_messages_serialized = MessageSerializer(recent_messages, many=True).data

                self.send(text_data= json.dumps({
                    'type':'recent_messages',
                    'message': recent_messages_serialized[::-1]
                }))
        
        if text_data_json['type'] == 'message':
            msg_object = Message.objects.create(chat=chat, author= self.account, content = text_data_json['message'])

            async_to_sync(self.channel_layer.group_send)(
                'chat_'+str(chat_id),
                { 
                    'type': 'message',
                    'message': MessageSerializer(msg_object, many= False).data
                })

    def message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'message',
            'message': message
        }))

