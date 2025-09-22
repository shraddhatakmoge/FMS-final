from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Accounts API
    path("api/accounts/", include("admin1.accounts.urls")),

    # Franchise API
    path("api/add-franchise/", include("admin1.add_franchise.urls")),

    # Events API
    path("api/events/", include("admin1.add_event.urls")),

    # Profiles API
    path("api/profiles/", include("admin1.profiles.urls")),

    # Students API
    path("api/students/", include("Franchise.add_student.urls")),

    # Courses API
    path("api/courses/", include("admin1.add_course.urls")),

    # Batches API
    path("api/batches/", include("Franchise.add_batch.urls")),

    # ✅ JWT endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('api/batches/', include('Franchise.add_batch.urls')),
    
    path("api/notifications/", include("admin1.notifications.urls")),
]
