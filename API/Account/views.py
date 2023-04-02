from rest_framework.decorators import permission_classes
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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
        except Exception as e:
            return Response({'status':e})
 
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

    #@action(methods=['POST'])
    #def edit(self, request):
