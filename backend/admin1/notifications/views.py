from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework import status

from django.shortcuts import get_object_or_404
@api_view(["GET"])
@permission_classes([IsAuthenticatedOrReadOnly])

def list_notifications(request):
    qs = Notification.objects.all().order_by("-created_at")
    serializer = NotificationSerializer(qs, many=True)
    return Response(serializer.data)



@api_view(["POST"])
def mark_read(request, pk):
    notification = get_object_or_404(Notification, pk=pk)
    notification.is_read = True
    notification.save(update_fields=["is_read"])
    print(f"✅ Notification {pk} marked as read")  # debug
    return Response({"status": "ok", "id": pk, "is_read": notification.is_read})


@api_view(["POST"])
def mark_all_read(request):
    Notification.objects.filter(is_read=False).update(is_read=True)
    return Response({"status": "success", "message": "All notifications marked as read"})
