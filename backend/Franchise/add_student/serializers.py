from rest_framework import serializers
from .models import Student
from admin1.add_franchise.models import AddFranchise

class FranchiseMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddFranchise
        fields = ["id", "name"]  # adjust if your field is `franchise_name`

class StudentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    franchise = FranchiseMiniSerializer(read_only=True)
    franchise_id = serializers.PrimaryKeyRelatedField(
        queryset=AddFranchise.objects.all(),
        source="franchise",
        write_only=True
    )

    class Meta:
        model = Student
        fields = [
            "id", "name", "email", "phone", "batch",
            "franchise", "franchise_id",
            "feesPaid", "feesPending", "status"
        ]
        read_only_fields = ["id"]
