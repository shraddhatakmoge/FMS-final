# notifications/services.py
from .models import Notification

def create_notification(message):
    """
    Creates a new notification and saves it to the database.
    """
    Notification.objects.create(message=message)
    print(f"Notification created: {message}") # for debugging