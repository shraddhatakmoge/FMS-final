from django.urls import path
from . import views


urlpatterns = [
    path("", views.list_notifications, name="notifications-list"),
    path("<int:pk>/mark_read/", views.mark_read, name="notification-mark-read"),
    path("mark_all_read/", views.mark_all_read, name="notifications-mark-all-read"),
]
