from django.urls import path, include
from API.Account import views

urlpatterns=[
    path('get/', views.AccountViewSet.as_view({'post':'retrieve'})),
    path('exists/', views.AccountViewSet.as_view({'post': 'exists'})),
    path('login/', views.AccountViewSet.as_view({'post':'login'})),
    path('update_image/', views.AccountViewSet.as_view({'post':'update_image'})),
    path('create/', views.AccountViewSet.as_view({'post':'create'})),
    path('edit/', views.AccountViewSet.as_view({'post':'edit'})),
]