from django.shortcuts import render
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from rest_framework.authtoken.models import Token

# Create your views here.

def register(request):
    if request.method == 'POST':
        return redirect('/@app/')
    return render(request, template_name='core/register.html')


def login(request):
    #print(request.COOKIES.get('userToken', None))
    #print(Token.objects.get(key = request.COOKIES.get('userToken', None)).user)
    if request.method == 'POST':
        return redirect('/@app/')
    return render(request, template_name='core/login.html')


def homepage(request):
    return render(request, template_name='core/homepage.html')

class app(TemplateView):
    template_name = "index.html"

    def get(self, request):
        #try:
            token = request.COOKIES.get('userToken', None)
            if not token:
                return redirect('/') 
            Token.objects.get(key=token).user
            return render(request, self.template_name)
        #except:
        #    return redirect('/login/')