from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Staff, Franchise
from django.db import transaction

class FranchiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Franchise
        fields = ['id', 'name', 'location']

# Read serializer (returns user email/name)
class StaffReadSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    franchise = FranchiseSerializer()

    class Meta:
        model = Staff
        fields = ['id', 'name', 'email', 'phone', 'salary', 'role', 'status', 'franchise', 'attendance', 'leaves', 'created_at']

    def get_name(self, obj):
        return obj.user.first_name

    def get_email(self, obj):
        return obj.user.email

# Create/update serializer (accepts password & email & name)
class StaffCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, required=True)
    franchise_id = serializers.PrimaryKeyRelatedField(queryset=Franchise.objects.all(), source='franchise', write_only=True, required=False)

    class Meta:
        model = Staff
        fields = ['id', 'name', 'email', 'password', 'franchise_id', 'phone', 'salary', 'role', 'status']

    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        franchise = validated_data.pop('franchise', None)

        with transaction.atomic():
            # create user using Django's create_user (handles hashing)
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
            staff = Staff.objects.create(user=user, franchise=franchise, **validated_data)
        return staff

    def update(self, instance, validated_data):
        # allow password update, name/email not editable here by default
        password = validated_data.pop('password', None)
        franchise = validated_data.pop('franchise', None)

        # update staff fields
        for attr, val in validated_data.items():
            setattr(instance, attr, val)

        if franchise is not None:
            instance.franchise = franchise

        instance.save()

        if password:
            instance.user.set_password(password)
            instance.user.save()

        return instance
