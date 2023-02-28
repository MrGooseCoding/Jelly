from rest_framework import serializers
from django.contrib.auth.models import User

from core.models import Account, Chat, Message

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=150)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email', 'is_active', 'date_joined')
        #extra_kwargs = {'password': {'write_only': True}} 

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.fist_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = Account
        fields = ('__all__')

    def create(self, validated_data):
        return Account(**validated_data)  

class ChatSerializer(serializers.ModelSerializer):
    members = AccountSerializer(many=True)
    class Meta:
        model=Chat
        fields=('__all__')

class MessageSerializer(serializers.ModelSerializer):
    author = AccountSerializer(many=False, read_only=True)

    class Meta:
        model = Message
        fields = '__all__'