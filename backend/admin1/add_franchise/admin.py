from django.contrib import admin
from .models import AddFranchise

@admin.register(AddFranchise)
class AddFranchiseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location", "start_date", "status")
    search_fields = ("name", "location")
    list_filter = ("status", "start_date")
    ordering = ("-created_at",)


