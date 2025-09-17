from rest_framework import viewsets
from .models import Staff, Franchise
from .serializers import StaffReadSerializer, StaffCreateSerializer, FranchiseSerializer

class FranchiseViewSet(viewsets.ModelViewSet):
    queryset = Franchise.objects.all()
    serializer_class = FranchiseSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('user', 'franchise').all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StaffCreateSerializer
        return StaffReadSerializer
