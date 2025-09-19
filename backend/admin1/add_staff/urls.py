from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from staff.views import StaffViewSet, FranchiseViewSet

router = routers.DefaultRouter()
router.register(r'franchises', FranchiseViewSet)
router.register(r'staff', StaffViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
