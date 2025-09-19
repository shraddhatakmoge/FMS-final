# admin1/add_event/views.py
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer
from notifications.services import create_notification

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        # The serializer.save() method returns the newly created model instance.
        instance = serializer.save()
        
        # CORRECTED: Use 'instance.name' instead of 'instance.title'
        message = f"A new event has been added: {instance.name}"
        
        create_notification(message)