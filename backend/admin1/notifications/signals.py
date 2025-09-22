from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from admin1.add_staff.models import Staff
from admin1.add_franchise.models import AddFranchise
from .models import Notification
from admin1.add_event.models import Event




@receiver(post_save, sender=Staff)
def staff_saved(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            message=f"Staff '{instance.name}' was added.",
            franchise=instance.franchise
        )
    else:
        Notification.objects.create(
            message=f"Staff '{instance.name}' was updated.",
            franchise=instance.franchise
        )

@receiver(post_delete, sender=Staff)
def staff_deleted(sender, instance, **kwargs):
    Notification.objects.create(
        message=f"Staff '{instance.name}' was removed.",
        franchise=instance.franchise
    )



@receiver(post_save, sender=AddFranchise)
def franchise_saved(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            message=f"Franchise '{instance.name}' was added."
        )
    else:
        Notification.objects.create(
            message=f"Franchise '{instance.name}' was updated."
        )

@receiver(post_delete, sender=AddFranchise)
def franchise_deleted(sender, instance, **kwargs):
    Notification.objects.create(
        message=f"Franchise '{instance.name}' was removed."
    )

@receiver(post_save, sender=Event)
def event_saved(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            message=f"Event '{instance.title}' was added.",
            franchise=instance.franchise if hasattr(instance, "franchise") else None
        )
    else:
        Notification.objects.create(
            message=f"Event '{instance.title}' was updated.",
            franchise=instance.franchise if hasattr(instance, "franchise") else None
        )


@receiver(post_delete, sender=Event)
def event_deleted(sender, instance, **kwargs):
    Notification.objects.create(
        message=f"Event '{instance.title}' was removed.",
        franchise=instance.franchise if hasattr(instance, "franchise") else None
    )
