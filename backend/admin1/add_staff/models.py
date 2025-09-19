from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Franchise(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.name

class Staff(models.Model):
    ROLE_CHOICES = [
        ('Instructor', 'Instructor'),
        ('Admin', 'Admin'),
        ('Support', 'Support'),
    ]
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]


    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    franchise = models.ForeignKey(Franchise, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff')
    phone = models.CharField(max_length=15, unique=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Instructor')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    attendance = models.JSONField(default=list, blank=True)   # store attendance snapshots
    leaves = models.JSONField(default=list, blank=True)        # simple leave records
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.role}"
