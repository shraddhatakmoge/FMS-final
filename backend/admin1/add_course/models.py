from django.db import models

class Course(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    instructor = models.CharField(max_length=100)
    students = models.CharField(max_length=255, blank=True)  # store IDs as CSV
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Active')
    start_date = models.DateField()
    branch = models.CharField(max_length=100, default='Wagholi Pune')

    def __str__(self):
        return self.name
