from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Accounts API
    path('api/accounts/', include('admin1.accounts.urls')),

    # Franchise API
    path('api/add-franchise/', include('admin1.add_franchise.urls')),

    # Events API (👈 fix here)
    path('api/events/', include('admin1.add_event.urls')),

    # profile of admin
    path("api/profiles/", include("admin1.profiles.urls")),

    
]
