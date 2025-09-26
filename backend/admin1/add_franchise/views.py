from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token   # add this
from .models import AddFranchise
from .serializers import FranchiseSerializer
from django.db import transaction


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

    # Override destroy to also delete associated User safely
    def destroy(self, request, *args, **kwargs):
        franchise = self.get_object()
        linked_user = franchise.user if hasattr(franchise, 'user') else None
        try:
            with transaction.atomic():
                # Delete the franchise first (will cascade attendance; staff FK set null)
                franchise.delete()
        except Exception as e:
            return Response({"detail": f"Failed to delete franchise: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Best-effort: delete linked user separately, but don't fail if it errors
        if linked_user:
            try:
                linked_user.delete()
            except Exception:
                pass

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

@api_view(['GET'])
def franchises_list(request):
    """Lightweight list of franchises for frontend dropdowns.
    Returns: [{id, name}]
    """
    items = AddFranchise.objects.all().values('id', 'name')
    return Response(list(items))