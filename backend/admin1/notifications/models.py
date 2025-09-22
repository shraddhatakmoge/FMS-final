from django.db import models

class Notification(models.Model):
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    franchise = models.ForeignKey(
        "add_franchise.AddFranchise",  
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    def __str__(self):
        return f"{self.created_at}: {self.message[:60]}"
