from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "phone", "batch", "franchise", "feesPaid", "feesPending", "status")
    list_filter = ("status", "franchise")
    search_fields = ("name", "email", "phone", "batch")
