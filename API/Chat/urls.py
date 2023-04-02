from django.urls import path, include
from API.Chat import views

urlpatterns=[
    path('get/', views.ChatViewSet.as_view({'post':'retrieve'})),
    path('create/', views.ChatViewSet.as_view({'post':'create'})),
    path('update_image/', views.ChatViewSet.as_view({'post':'update_image'})),
    path('edit/', views.ChatViewSet.as_view({'post':'edit'})),
    path('kick_user/', views.ChatViewSet.as_view({'post':'kick_user'})),
]