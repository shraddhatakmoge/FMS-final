from django.core.mail import send_mail
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Staff

User = get_user_model()

class StaffSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Staff
        fields = ['id', 'name', 'email', 'password', 'franchise', 'phone', 'salary', 'status']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Ensure role is always 'staff'
        validated_data['role'] = 'staff'

        # Check if user exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists.'})

        # Create User with role='staff'
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            role='staff'
        )

        staff = Staff.objects.create(user=user, **validated_data)

        # ✅ Send email
        subject = "Welcome to the Team!"
        message = f"""
Hello {staff.name},

You have been added as a staff member.

Your login details:
Email: {email}
Password: {password}

Please login and change your password after first login.

Thanks,
Your Company
"""
        send_mail(subject, message, None, [email], fail_silently=False)

        return staff
