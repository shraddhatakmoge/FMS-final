# add_staff/urls.py
from django.urls import path
from .views import FranchiseListAPIView, StaffListCreateAPIView

# add_staff/urls.py
urlpatterns = [
    
    path('franchise/', FranchiseListAPIView.as_view(), name='franchise-list'),
    path('', StaffListCreateAPIView.as_view(), name='staff-list-create'),
]

