from django.db import models
from django.conf import settings

class Staff(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, default='Active')
    role = models.CharField(max_length=20, default='staff')  # fixed as 'staff'
    franchise = models.CharField(max_length=100, default='Wagholi Pune')

    def __str__(self):
        return self.name
