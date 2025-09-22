from django.db import models
from admin1.add_franchise.models import AddFranchise  # correct import

class Student(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    batch = models.CharField(max_length=50)

    # Temporary FK for migration
    # models.py
    franchise = models.ForeignKey(AddFranchise, on_delete=models.CASCADE, null=True, blank=True)

    # Other fields
    feesPaid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    feesPending = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.batch})"
