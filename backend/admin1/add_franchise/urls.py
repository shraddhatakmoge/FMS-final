from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FranchiseViewSet, dashboard_stats

router = DefaultRouter()
router.register(r'franchise', FranchiseViewSet, basename='franchise')

urlpatterns = [
    path('', include(router.urls)),                # /api/franchise/
    path('dashboard-stats/', dashboard_stats),     # /api/dashboard-stats/
]
