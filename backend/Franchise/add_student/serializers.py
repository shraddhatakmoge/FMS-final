from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Student
        fields = ["id", "name", "email", "phone", "batch", "franchise", "feesPaid", "feesPending", "status"]
        read_only_fields = ["id"]



