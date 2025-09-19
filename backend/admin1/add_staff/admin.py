from django.contrib import admin
from .models import Franchise, Staff

@admin.register(Franchise)
class FranchiseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'franchise', 'phone', 'status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'phone')
    raw_id_fields = ('user',)
