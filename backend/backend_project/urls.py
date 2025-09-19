from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("admin1.accounts.urls")),
    path("api/add-franchise/", include("admin1.add_franchise.urls")),
    path("api/events/", include("admin1.add_event.urls")),
    path("api/profiles/", include("admin1.profiles.urls")),
    path("api/courses/", include("admin1.add_course.urls")),
    path('api/batches/', include('Franchise.add_batch.urls')),
    path("api/notifications/", include("notifications.urls")),
]