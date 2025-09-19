from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Course
from .serializers import CourseSerializer
from notifications.services import create_notification
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            print("Serializer validation errors:", serializer.errors)  # Debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        instance = serializer.save()
        message = f"A new course has been added: {instance.name}"
        create_notification(message)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # franchise heads must be logged in
def franchise_courses_list(request):
    """
    Read-only API for franchise heads to view all courses.
    """
    # Optional: filter by branch if your franchise head user has a branch
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)
