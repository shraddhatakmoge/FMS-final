# notifications/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(source='created_at', format="%b %d, %Y %I:%M %p", read_only=True)
    message = serializers.CharField(source='message', read_only=True)
    read = serializers.BooleanField(source='is_read', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'message', 'time', 'read']