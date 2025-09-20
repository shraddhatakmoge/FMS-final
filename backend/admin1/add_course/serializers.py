from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(source='start_date')

    students = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    students_display = serializers.CharField(source='students', read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'name',
            'category',
            'duration',
            'instructor',
            'students',          # For write
            'students_display',  # For read
            'status',
            'branch',
            'startDate',
        ]

    def create(self, validated_data):
        # Convert list of integers -> comma-separated string
        students_list = validated_data.pop('students', [])
        validated_data['students'] = ','.join(map(str, students_list))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        students_list = validated_data.pop('students', None)
        if students_list is not None:
            validated_data['students'] = ','.join(map(str, students_list))
        return super().update(instance, validated_data)
