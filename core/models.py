from importlib.resources import contents
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

import os

import datetime

# Create your models here.

def get_account_image_path(instance, filename):
    return '/'.join([type(instance).__name__, str(instance.user.id), filename])

def get_image_path(instance, filename):
    return '/'.join([type(instance).__name__, str(instance.id), filename])

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to=get_account_image_path, blank=True, null=True)
    description = models.CharField(blank=True, max_length=200)

    def __str__(self):
        return f"{self.user.username} | {self.user.id}"

class Chat(models.Model):
    name = models.CharField(max_length=42, blank=True)
    description = models.CharField(max_length=100, blank=True, null=True)  #Blank and null are true because there are some chats old that dont have description 
    members = models.ManyToManyField(Account)
    admins = models.ManyToManyField(Account, related_name='chat_admins')
    image = models.ImageField(upload_to=get_image_path, blank=True, null=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    chat = models.ForeignKey(Chat, null=True, on_delete=models.CASCADE, related_name='chat')
    author = models.ForeignKey(Account, null=True ,on_delete=models.CASCADE, related_name='author')
    content = models.CharField(max_length=4000)
    pub_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.content} | {self.id}'

    def was_sent_recently(self):
        return self.pub_date >= (timezone.now() - datetime.timedelta(days=1))   