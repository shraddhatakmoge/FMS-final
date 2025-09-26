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
<<<<<<< HEAD
from .models import Staff, AttendanceRecord
from Franchise.add_student.models import Student
from admin1.add_franchise.models import AddFranchise
=======
from .models import Staff
from admin1.add_franchise.models import AddFranchise  
from admin1.add_franchise.serializers import FranchiseSerializer
>>>>>>> fdd82c8e5603c5b702e2b56ca41c5e3120dd7c7f

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
    franchise_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Staff
<<<<<<< HEAD
        fields = ['id', 'name', 'email', 'password', 'franchise', 'franchise_id', 'phone', 'salary', 'status', 'batch']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        franchise_id = validated_data.pop('franchise_id', None)

        # Ensure role is always 'staff'
        validated_data['role'] = 'staff'

        # Map franchise_id -> franchise name if provided
        if franchise_id:
            fran = AddFranchise.objects.filter(id=franchise_id).first()
            if not fran:
                raise serializers.ValidationError({'franchise_id': 'Invalid franchise id'})
            validated_data['franchise'] = fran.name
            validated_data['franchise_fk'] = fran

        # Check if user exists
=======
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

>>>>>>> fdd82c8e5603c5b702e2b56ca41c5e3120dd7c7f
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

    def update(self, instance, validated_data):
        # support updating franchise via franchise_id too
        franchise_id = validated_data.pop('franchise_id', None)
        if franchise_id:
            fran = AddFranchise.objects.filter(id=franchise_id).first()
            if not fran:
                raise serializers.ValidationError({'franchise_id': 'Invalid franchise id'})
            validated_data['franchise'] = fran.name
            validated_data['franchise_fk'] = fran

        # Prevent updating email/password here
        validated_data.pop('email', None)
        validated_data.pop('password', None)
        return super().update(instance, validated_data)


class AttendanceRecordSerializer(serializers.ModelSerializer):
    # Enrich read with staff name and staffId when available
    name = serializers.SerializerMethodField(read_only=True)
    staffId = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'franchise', 'person_type', 'person_id', 'date',
            'status', 'in_time', 'out_time', 'name', 'staffId'
        ]

    def get_name(self, obj):
        if obj.person_type == 'staff':
            s = Staff.objects.filter(id=obj.person_id).first()
            return s.name if s else None
        if obj.person_type == 'student':
            st = Student.objects.filter(id=obj.person_id).first()
            return st.name if st else None
        return None

    def get_staffId(self, obj):
        # fallback to person_id if no explicit staffId field exists
        return obj.person_id


class BulkAttendanceSerializer(serializers.ListSerializer):
    child = AttendanceRecordSerializer()

    def create(self, validated_data):
        created_or_updated = []
        for item in validated_data:
            # Normalize person_type
            ptype = item.get('person_type', 'staff')
            # Upsert based on unique constraints (include person_type in lookup)
            obj, _ = AttendanceRecord.objects.update_or_create(
                franchise_id=item['franchise'],
                person_type=ptype,
                person_id=item['person_id'],
                date=item['date'],
                defaults={
                    'status': item.get('status', 'Present'),
                    'in_time': item.get('in_time'),
                    'out_time': item.get('out_time'),
                }
            )
            created_or_updated.append(obj)
        return created_or_updated


# Lightweight input serializer to validate POST /api/attendance/ without unique_together checks
class AttendanceInputSerializer(serializers.Serializer):
    franchise = serializers.IntegerField(required=False)
    person_type = serializers.ChoiceField(choices=["staff", "student"], required=False)
    person_id = serializers.IntegerField()
    date = serializers.DateField()
    status = serializers.CharField(required=False, allow_blank=True)
    in_time = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    out_time = serializers.CharField(required=False, allow_null=True, allow_blank=True)
