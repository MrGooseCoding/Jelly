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
        data = request.data['account']
        user_already_exists = Account.objects.filter(user__username=data['user']['username']).exists()
        username_regex = r'^[0-9a-zA-Z._+]+$'

        user_serializer = UserSerializer(data={
            "username":data['user']['username'].strip(),
            "first_name":data['user']['username'].strip(),
            "password":data['user']['password1'],
            "email":""
        })

        if not re.fullmatch(username_regex, data['user']['username'].strip()) or user_already_exists:
            return Response({'status':'Invalid username'})

        if data['user']['password2'] != data['user']['password1']:
            return Response({'status':'Invalid password2'})

        user_valid = user_serializer.is_valid()

        if not user_valid:
            return Response({'status':user_serializer.errors})

        user = User(username = data['user']['username'], first_name=data['user']['first_name'])
        user.save()
        user.set_password(data['user']['password1'])
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

    @action(methods=['POST'], detail=True)
    def edit(self, request):
        """
            Request data params are:
                username: str/empty | The user's new username, leave empty to keep the original 
                first_name: str/empty | The user's new first_name, leave empty to keep the original one
                description: str/empty | The user's new description, leave empty to keep the original one
            
            The request must have a userToken auth param to identify the user
        """

        account = Account.objects.get(user=request.user)

        if not request.data['username'].strip() == request.user.username:
            if User.objects.filter(username=request.data['username'].strip()).exists():
                return Response({'status':'Username is already taken'})

        account_serializer = AccountSerializer(data={
            "description":request.data['description']
        })

        user_serializer = UserSerializer(data={
            "username":request.data['username'],
            "first_name":request.data['first_name'],
            "email":"",
            "password":"SomeDummyPass"
        })

        if not user_serializer.is_valid() or not account_serializer.is_valid():
            return Response({'account': account_serializer.errors, 'user': user_serializer.errors})

        print(request.data)
        account = account_serializer.update(instance=account, validated_data=request.data)

        return Response({'account': AccountSerializer(account).data})
