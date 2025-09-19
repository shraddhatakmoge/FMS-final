from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, franchise_courses_list

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course')

urlpatterns = [
    # Admin CRUD APIs
    path('', include(router.urls)),

    # Franchise head read-only API
    path('franchise-view-courses/', franchise_courses_list, name='franchise_courses_list'),
]
