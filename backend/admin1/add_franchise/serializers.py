import threading
from django.core.mail import send_mail
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AddFranchise

User = get_user_model()

def send_welcome_email(email, franchise_name, password):
    """Helper to send email in background"""
    send_mail(
        subject="Franchise Management System Login",
        message=(
            f"Hello {franchise_name},\n\n"
            f"Your password for Franchise Management System is: {password}\n\n"
            f"Please change your password after first login."
        ),
        from_email="shraddhatakmoge@gmail.com",  # should match EMAIL_HOST_USER
        recipient_list=[email],
        fail_silently=False,
    )

class FranchiseSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = AddFranchise
        fields = ["id", "name", "location", "start_date", "status", "email", "password"]

    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})

        # create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            role="franchise_head"
        )

        # link user to franchise
        franchise = AddFranchise.objects.create(user=user, **validated_data)

        # send email asynchronously
        threading.Thread(
            target=send_welcome_email, 
            args=(email, franchise.name, password)
        ).start()

        return franchise
