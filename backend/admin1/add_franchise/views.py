from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import AddFranchise
from .serializers import FranchiseSerializer

User = get_user_model()

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

    # ✅ Override destroy to also delete User
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            instance.user.delete()  # this also deletes AddFranchise (CASCADE)
        else:
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Alternative standalone API (optional, if you prefer separate URL)
@api_view(['GET'])
def dashboard_stats(request):
    data = {
        "total_franchises": AddFranchise.objects.count(),
        "active_franchises": AddFranchise.objects.filter(status="active").count(),
        "inactive_franchises": AddFranchise.objects.filter(status="inactive").count(),
    }
    return Response(data)