# add_staff/views.py
from rest_framework import generics
from .models import Staff
from admin1.add_franchise.models import AddFranchise
from .serializers import StaffSerializer, FranchiseSerializer

# Franchise dropdown API
class FranchiseListAPIView(generics.ListAPIView):
    queryset = AddFranchise.objects.all()
    serializer_class = FranchiseSerializer

# Staff API
class StaffListCreateAPIView(generics.ListCreateAPIView):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Staff
from .serializers import StaffSerializer
from admin1.add_franchise.serializers import FranchiseSerializer

class StaffListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Franchise head: only see their staff
        if hasattr(user, "franchise") and user.franchise:
            return Staff.objects.filter(franchise=user.franchise)
        # Admin: see all staff
        return Staff.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        # Franchise head: assign their franchise automatically
        if hasattr(user, "franchise") and user.franchise:
            serializer.save(franchise=user.franchise, role="Staff")
        else:
            # Admin can specify franchise in POST payload
            serializer.save(role="Staff")

