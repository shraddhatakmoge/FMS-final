# add_staff/models.py
from django.db import models
<<<<<<< HEAD
from django.conf import settings
from admin1.add_franchise.models import AddFranchise

class Staff(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, default='Active')
    role = models.CharField(max_length=20, default='staff')  # fixed as 'staff'
    # The batch this staff is responsible for (used to scope student attendance)
    batch = models.CharField(max_length=100, null=True, blank=True)
    # Legacy human-readable name (kept for backward compatibility)
    franchise = models.CharField(max_length=100, default='Wagholi Pune')
    # New canonical relation
    franchise_fk = models.ForeignKey(
        AddFranchise,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_members'
    )

    def __str__(self):
        return self.name


class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ("Present", "Present"),
        ("Absent", "Absent"),
        ("Late", "Late"),
        ("Excused", "Excused"),
    )

    franchise = models.ForeignKey(AddFranchise, on_delete=models.CASCADE, related_name="attendance_records")
    person_type = models.CharField(max_length=20, default="staff")  # future-proofing
    person_id = models.IntegerField()  # references Staff.id when person_type == 'staff'
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Present")
    in_time = models.TimeField(null=True, blank=True)
    out_time = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("franchise", "person_type", "person_id", "date")
        ordering = ["-date", "person_id"]

    def __str__(self):
        return f"{self.date} {self.person_type}:{self.person_id} ({self.franchise_id})"
=======

class Staff(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    franchise = models.ForeignKey(
        'add_franchise.AddFranchise',  # <-- use app_label.ModelName as string
        on_delete=models.CASCADE,
        related_name='staff'
    )
    phone = models.CharField(max_length=15)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')

    def __str__(self):
        return f"{self.name} ({self.role})"
>>>>>>> fdd82c8e5603c5b702e2b56ca41c5e3120dd7c7f
