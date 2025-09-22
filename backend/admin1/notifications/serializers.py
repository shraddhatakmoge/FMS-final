from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    franchiseId = serializers.IntegerField(source="franchise.id", read_only=True)
    franchiseName = serializers.CharField(source="franchise.name", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "message", "is_read", "created_at", "franchiseId", "franchiseName"]
