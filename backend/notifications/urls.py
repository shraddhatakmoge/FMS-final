# notifications/urls.py
from django.urls import path
from .views import NotificationListView, MarkNotificationAsReadView, MarkAllNotificationsAsReadView

urlpatterns = [
    path('list/', NotificationListView.as_view(), name='notification-list'),
    path('mark-read/<int:pk>/', MarkNotificationAsReadView.as_view(), name='mark-read'),
    path('mark-all-read/', MarkAllNotificationsAsReadView.as_view(), name='mark-all-read'),
]