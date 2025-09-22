from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("message", "created_at", "is_read", "franchise")
    
    list_filter = ("is_read", "created_at")
    search_fields = ("message",)
