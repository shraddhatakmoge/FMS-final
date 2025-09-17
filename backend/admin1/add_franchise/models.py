# add_franchise/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AddFranchise(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="franchise", null=True, blank=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    start_date = models.DateField()
    status = models.CharField(max_length=20, choices=[("active", "Active"), ("inactive", "Inactive")])
    created_at = models.DateTimeField(auto_now_add=True)
