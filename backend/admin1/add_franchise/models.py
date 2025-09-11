from django.db import models

class AddFranchise(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[("active", "Active"), ("inactive", "Inactive")],
        default="inactive"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
