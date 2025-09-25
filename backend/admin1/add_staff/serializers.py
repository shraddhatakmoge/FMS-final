# # add_staff/serializers.py
# from rest_framework import serializers
# from .models import Staff
# from admin1.add_franchise.models import AddFranchise

# # Serializer for Franchise dropdown
# class FranchiseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = AddFranchise
#         fields = ['id', 'name']

# # Serializer for Staff
# class StaffSerializer(serializers.ModelSerializer):
#     # Include franchise name for frontend display
#     franchise_name = serializers.CharField(source='franchise.name', read_only=True)

#     class Meta:
#         model = Staff
#         fields = [
#             'id',
#             'name',
#             'role',
#             'franchise',      # ID of franchise (for POST/PUT)
#             'franchise_name', # read-only for table display
#             'phone',
#             'salary',
#             'status',
#         ]
    
import threading
from django.core.mail import send_mail
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Staff
from admin1.add_franchise.models import AddFranchise  
from admin1.add_franchise.serializers import FranchiseSerializer

User = get_user_model()

# Background email sender
def send_staff_welcome_email(email, staff_name, password):
    try:
        send_mail(
            subject="Franchise Management System Login",
            message=(
                f"Hello {staff_name},\n\n"
                f"Your login details for Franchise Management System:\n"
                f"Email: {email}\n"
                f"Password: {password}\n\n"
                f"Please change your password after first login."
            ),
            from_email="shraddhatakmoge@gmail.com",
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        print("Failed to send staff email:", e)

# Serializer for Staff
class StaffSerializer(serializers.ModelSerializer):
    franchise_name = serializers.CharField(source="franchise.name", read_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Staff
        fields = [
            "id",
            "name",
            "role",
            "franchise",
            "franchise_name",
            "phone",
            "salary",
            "status",
            "email",
            "password",
        ]

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        name = validated_data.get("name")
        franchise = validated_data.get("franchise")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

        # 1️⃣ Create User
        user = User.objects.create_user(
            username=email.split("@")[0],
            email=email,
            password=password,
            role="staff"  # adjust if you have a role field
        )

        # 2️⃣ Create Staff record
        staff = Staff.objects.create(**validated_data)

        # 3️⃣ Send email in background
        threading.Thread(
            target=send_staff_welcome_email,
            args=(email, name, password)
        ).start()

        return staff
