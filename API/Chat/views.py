from django.shortcuts import get_object_or_404
from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from core.models import *

from serializers import *

import json

class ChatViewSet(ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication]

    @permission_classes([IsAuthenticated])
    def retrieve(self, request):
        print(request.user.username)
        chat = Account.objects.get(user__username=request.user.username).chat_set.all()
        return Response(ChatSerializer(chat, many=True).data)

    @permission_classes([IsAuthenticated])
    def create(self, request):
        print(request.data)
        print('Members:')
        data = json.loads(request.data['chat'])
        print(json.loads(request.data['chat'])['members'])
        print('User:')
        print(request.user.username)
        account = Account.objects.get(user__username=request.user.username)
        chatData = {"members": [], "name": data['name'], "description": data['description'], "image": None} 

        for username in data['members']:
            print(username)
            account = get_object_or_404(Account, user__username=username)
            if username != request.user.username and username not in chatData['members']:  
                chatData["members"].append(account)

        if len(chatData['members']) == 0:
            return Response({'status':'Invalid Members'})

        chatData['members'].append(Account.objects.get(user__username=request.user.username))

        if len(chatData['name']) == 0:
            return Response({'Invalid Name'})

        chat = Chat(name=chatData['name'], description=chatData['description'], image=chatData['image'])
        chat.save()
        chat.members.set(chatData['members'])
        chat.admins.set([account])
        return Response({'data': ChatSerializer(chat).data})

    @action(detail=True)
    @permission_classes([IsAuthenticated])
    def update_image(self, request):
        print(request.user)
        print(request.data)
        account = Account.objects.get(user=request.user)
        chat = Chat.objects.get(pk=int(request.data['chat_id']))
        print(ChatSerializer(chat).data)
        if not account in chat.members.all():
            return Response({'status':'Account not member of chat'})
        try:
            Image = request.data['image']
        except KeyError:
            return Response({'status': 'Request has no resource file attached'})
        chat.image = Image
        chat.save()
        return Response(ChatSerializer(chat).data)

    @action(detail=True)
    @permission_classes([IsAuthenticated])  
    def kick_user(self, request):
        """
            Request data params are:
                user: str | the user's username
                chat: int | The chat's id 
            
            The request header must have a userToken auth param to check if the user is the Chat's admin or not
        """
        
        user = Account.objects.get(user=request.user)
        user_to_kick = Account.objects.get(user__username=request.data['user']) 
        chat = Chat.objects.get(pk=request.data['chat'])

        if not user in chat.admins.all():
            return Response({'status':'You do not have permission to do this'})
        if user_to_kick in chat.admins.all():
            return Response({'status':'You can not kick an admin'})

        chat.members.remove(user_to_kick)

        return Response(ChatSerializer(chat).data)

    @action(detail=True)
    @permission_classes([IsAuthenticated])
    def edit(self, request):
        """
            Request data params are:
                chat: int | The chat's id 
                name: str/empty | The chat's new name, leave empty to keep the original one
                description: str/empty | The chat's new description, leave empty to keep the original one
            
            The request must have a userToken auth param to check if the user is the Chat's admin or not
        """

        user = Account.objects.get(user=request.user)
        chat = Chat.objects.get(pk=request.data['chat'])
        if not user in chat.admins.all():
            return Response({'status':'You do not have permission to do this'})

        name = request.data['name'] if request.data['name'] != None else chat.name
        description = request.data['description'] if request.data['description'] != None else chat.description

        serializer = ChatSerializer(data={
            'name':name, 
            'description':description, 
            #'image':chat.image, 
            'members':AccountSerializer(chat.members.all(), many=True).data, 
            'admins':[i.id for i in chat.admins.all()]
        })

        if not serializer.is_valid():
            return Response({'status':serializer.errors})

        chat = serializer.update(chat, {"name":name, "description":description})

        return Response(ChatSerializer(chat).data)