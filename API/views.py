from django.shortcuts import get_object_or_404
from rest_framework.decorators import permission_classes, api_view
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from core.models import *

from serializers import *

import re
import json

class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    authentication_classes = [TokenAuthentication, SessionAuthentication, BasicAuthentication] 

    @permission_classes([IsAuthenticated])
    def retrieve(self, request):
        try:
            account = Account.objects.get(user__id=request.user.id)
            return Response(AccountSerializer(account).data)
        except TypeError:
            return Response({'status':'User not logged in'})
 
    def create(self, request): # Remember to test crsf protection on this view
        data = json.loads(request.data['account'])
        user_already_exists = Account.objects.filter(user__username=data['user']['username']).exists()
        username_regex = r'^[0-9a-zA-Z._+]+$'
        if not re.fullmatch(username_regex, data['user']['username'].strip()) or user_already_exists:
            return Response({'status':'Invalid username'})

        if len(data['user']['first_name'].strip()) < 1:
            return Response({'status':'Invalid first_name'})

        if len(data['user']['password1'].strip()) < 8:
            return Response({'status':'Invalid password1'})

        if data['user']['password2'].strip() != data['user']['password1'].strip():
            return Response({'status':'Invalid password2'})

        user = User(username = data['user']['username'].strip(), first_name=data['user']['first_name'], password=data['user']['password1'])
        user.save()
        account = Account(user = user)
        account.save()
        token = Token.objects.create(user = user)
        response = AccountSerializer(account).data
        response['token'] = token.key
        
        return Response(response)

    def login(self, request):
        try:
            if authenticate(username=request.data['username'], password=request.data['password']):
                token= Token.objects.get_or_create(user=User.objects.get(username=request.data['username']))[0]
                print(token.key)
                print(request.data['username'], token.key)

                return Response({"token":token.key})
            return Response({"status": "Invalid Username or Password"})
        except KeyError:
            return Response({'status':'Missing Arguments'})

    @action(detail=True)
    @permission_classes([IsAuthenticated])
    def update_image(self, request):
        print(request.user)
        print(request.auth)
        account = Account.objects.get(user__id=request.user.id)
        try:
            Image = request.data['image']
        except KeyError:
            return Response({'status': 'Request has no resource file attached'})
        account.image = Image
        account.save()
        return Response(AccountSerializer(account).data)

    @action(methods=['POST'], detail=True) 
    def exists(self, request):
        user_already_exists = Account.objects.filter(user__username=request.data['username']).exists()
        return Response({'data':user_already_exists})

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

    
