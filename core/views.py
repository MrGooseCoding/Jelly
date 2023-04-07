from django.shortcuts import render
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from .models import *
from serializers import *

def join_user(request):
    print(request.POST)
    if joinUser:=request.POST.get('joinUser', False):
        join_account = get_object_or_404(Account, user__username=joinUser)
        user = Token.objects.get(key=request.COOKIES.get('userToken', None)).user
        user_account = Account.objects.get(user=user)
        print('|',user_account,'|', join_account,'|', joinUser)
        if join_account != user_account:
            chat = Chat(name=f'{user_account.user.first_name} & {join_account.user.first_name}',
                description='The beginning of a wonderful frienship')
            chat.save()
            chat.members.set([join_account, user_account])
            chat.admins.set([user_account])
            chat.save()

# Create your views here.
def register(request):
    if request.method == 'POST':
        join_user(request)
        return redirect('/@app/')
    return render(request, template_name='core/register.html')


def login(request):
    #print(request.COOKIES.get('userToken', None))
    #print(Token.objects.get(key = request.COOKIES.get('userToken', None)).user)
    if request.method == 'POST':
        join_user(request)
        return redirect('/@app/')
    return render(request, template_name='core/login.html')


def homepage(request):
    return render(request, template_name='core/homepage.html')

def account_view(request, username):
    account = Account.objects.get(user__username=username)
    account_serialized = AccountSerializer(account).data
    print(account_serialized)
    return render(request, template_name='core/account.html', context={'account':account_serialized})

class app(TemplateView):
    template_name = "index.html"

    def get(self, request):
        try:
            token = request.COOKIES.get('userToken', None)
            print(token)
            if not token:
                return redirect('/') 
            Token.objects.get(key=token).user
            return render(request, self.template_name)
        except Exception as e:
            print(e)
            return redirect('/login/')