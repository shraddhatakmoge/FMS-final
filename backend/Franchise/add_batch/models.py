from django.db import models

class Batch(models.Model):
    name = models.CharField(max_length=100)
    franchise = models.CharField(max_length=100)
    students = models.IntegerField()
    start = models.DateField()
    end = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=[("Active", "Active"), ("Inactive", "Inactive")],
        default="Active"
    )

    def __str__(self):
        return f"{self.name} - {self.franchise}"
