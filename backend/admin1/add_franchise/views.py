# admin1/add_franchise/views.py
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import AddFranchise
from .serializers import FranchiseSerializer
from notifications.services import create_notification

class FranchiseViewSet(viewsets.ModelViewSet):
    queryset = AddFranchise.objects.all().order_by('-created_at')
    serializer_class = FranchiseSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # CORRECTED: Use 'instance.name' to match your model
        message = f"A new franchise has been added: {instance.name}" 
        create_notification(message)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        data = {
            "total_franchises": AddFranchise.objects.count(),
            "active_franchises": AddFranchise.objects.filter(status="active").count(),
            "inactive_franchises": AddFranchise.objects.filter(status="inactive").count(),
        }
        return Response(data)

@api_view(['GET'])
def dashboard_stats(request):
    data = {
        "total_franchises": AddFranchise.objects.count(),
        "active_franchises": AddFranchise.objects.filter(status="active").count(),
        "inactive_franchises": AddFranchise.objects.filter(status="inactive").count(),
    }
    return Response(data)