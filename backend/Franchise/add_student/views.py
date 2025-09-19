from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('-created_at')
    serializer_class = StudentSerializer

    # Optional: dashboard stats for students
    @action(detail=False, methods=['get'])
    def stats(self, request):
        data = {
            "total_students": Student.objects.count(),
            "active_students": Student.objects.filter(status="Active").count(),
            "inactive_students": Student.objects.filter(status="Inactive").count(),
            }
        return Response(data)


    # Optional: override destroy if you need any extra cleanup
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
