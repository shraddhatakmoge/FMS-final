from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token   # ✅ add this
from .models import AddFranchise
from .serializers import FranchiseSerializer


User = get_user_model()

class FranchiseViewSet(viewsets.ModelViewSet):
    queryset = AddFranchise.objects.all().order_by('-created_at')
    serializer_class = FranchiseSerializer

    
    def perform_create(self, serializer):
        franchise = serializer.save()
        return franchise

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
        franchise = self.get_object()
        if franchise.user:
            franchise.user.delete()  # deletes the user AND the franchise (CASCADE)
        else:
            franchise.delete()       # fallback
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