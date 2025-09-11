from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('franchise_head', 'Franchise Head'),
        ('staff', 'Staff'),
        ('student', 'Student'),
    )
    # use email as unique identifier
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    branch = models.CharField(max_length=100, blank=True, null=True)

    USERNAME_FIELD = "email"   # login with email instead of username
    REQUIRED_FIELDS = ["username"]  # username still required internally

    def __str__(self):
        return f"{self.email} ({self.role})"