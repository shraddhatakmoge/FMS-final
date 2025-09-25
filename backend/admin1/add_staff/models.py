# add_staff/models.py
from django.db import models

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
