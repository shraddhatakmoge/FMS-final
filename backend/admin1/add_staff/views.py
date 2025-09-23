from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Staff
from .serializers import StaffSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def destroy(self, request, *args, **kwargs):
        staff = self.get_object()
        user = getattr(staff, "user", None)

        # Delete the linked user first
        if user:
            user.delete()  # deletes email, password, everything in auth_user table

        # Delete staff after user
        staff.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
