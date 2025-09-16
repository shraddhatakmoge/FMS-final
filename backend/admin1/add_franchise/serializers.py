from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AddFranchise

User = get_user_model()

class FranchiseSerializer(serializers.ModelSerializer):
    # extra write-only fields for user creation
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AddFranchise
        fields = ["id", "name", "location", "start_date", "status", "email", "password"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        # ✅ create user in accounts
        user = User.objects.create_user(
            username=email,   # still required by AbstractUser
            email=email,
            password=password,
            role="franchise_head"
        )

        # ✅ create franchise record
        franchise = AddFranchise.objects.create(**validated_data)
        return franchise
