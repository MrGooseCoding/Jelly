from rest_framework import serializers
from django.contrib.auth.models import User

from core.models import Account, Chat, Message

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=150)
    password = serializers.CharField(required=True, min_length=8, write_only=True)
    first_name = serializers.CharField(required=True, min_length=1, max_length=150)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'email', 'is_active', 'date_joined', 'password')

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    description = serializers.CharField(max_length=200, allow_null=True, allow_blank=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Account
        fields = ('__all__')

    def create(self, validated_data):
        return Account(**validated_data)  

    def update(self, instance, validated_data):
        instance.description = validated_data.get('description', instance.description)
        print(instance.user)
        UserSerializer(instance.user).update(instance=instance.user, validated_data=validated_data)
        instance.save()
        return instance

class ChatSerializer(serializers.ModelSerializer):
    members = AccountSerializer(many=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model=Chat
        fields=('__all__')

    def update(self, instance, validated_data:dict):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        return instance

    def create(self, data):
        return Chat(**data)

class MessageSerializer(serializers.ModelSerializer):
    author = AccountSerializer(many=False, read_only=True)

    class Meta:
        model = Message
        fields = '__all__'