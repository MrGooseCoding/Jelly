from django.urls import path, include

urlpatterns = [
    path('account/', include('API.Account.urls')),
    path('chat/', include('API.Chat.urls')),
]