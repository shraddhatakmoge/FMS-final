from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    # Proper mapping of start_date to startDate in API
    startDate = serializers.DateField(source='start_date')

    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'category',
            'duration',
            'instructor',
            'students',
            'status',
            'branch',
            'startDate',
        ]
