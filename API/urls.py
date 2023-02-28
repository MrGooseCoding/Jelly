from django.urls import path, include
from django.views.generic import TemplateView

from API import views

urlpatterns = [
    path('account/get/', views.AccountViewSet.as_view({'post':'retrieve'})),
    path('account/exists/', views.AccountViewSet.as_view({'post': 'exists'})),
    path('account/login/', views.AccountViewSet.as_view({'post':'login'})),
    path('account/update_image/', views.AccountViewSet.as_view({'post':'update_image'})),
    path('account/create/', views.AccountViewSet.as_view({'post':'create'})),

    path('chat/get/', views.ChatViewSet.as_view({'post':'retrieve'})),
    path('chat/create/', views.ChatViewSet.as_view({'post':'create'})),
    path('chat/update_image/', views.ChatViewSet.as_view({'post':'update_image'})),
]