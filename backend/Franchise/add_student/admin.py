from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "batch",
        "franchise",
        "feesPaid",
        "feesPending",
        "status",
        "created_at",
    )
    list_filter = ("batch", "franchise", "status")
    search_fields = ("name", "email", "phone", "franchise")
    ordering = ("-created_at",)
