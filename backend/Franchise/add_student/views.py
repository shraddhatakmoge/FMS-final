from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer
from admin1.add_franchise.models import AddFranchise
from admin1.add_staff.models import Staff

class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer

    def get_queryset(self):
        user = self.request.user

        # Prevent crash for anonymous users
        if not user.is_authenticated:
            return Student.objects.none()

        # Admin sees all
        if getattr(user, "role", None) == "admin":
            return Student.objects.all().order_by("-created_at")

        # Franchise head
        franchise = getattr(user, "franchise", None)
        if getattr(user, "role", None) == "franchise_head" and franchise:
            return Student.objects.filter(franchise=franchise).order_by("-created_at")

        # Staff: scope by their franchise and batch
        if getattr(user, "role", None) == "staff":
            staff = Staff.objects.filter(user=user).select_related("franchise_fk").first()
            if staff and staff.franchise_fk:
                qs = Student.objects.filter(franchise=staff.franchise_fk)
                if getattr(staff, "batch", None):
                    qs = qs.filter(batch=staff.batch)
                return qs.order_by("-created_at")

        # Default empty queryset
        return Student.objects.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user

        if not user.is_authenticated:
            return Response({
                "total_students": 0,
                "active_students": 0,
                "inactive_students": 0
            })

        if getattr(user, "role", None) == "admin":
            students = Student.objects.all()
        else:
            franchise = getattr(user, "franchise", None)
            students = Student.objects.filter(franchise=franchise) if franchise else Student.objects.none()

        data = {
            "total_students": students.count(),
            "active_students": students.filter(status="Active").count(),
            "inactive_students": students.filter(status="Inactive").count(),
        }
        return Response(data)
