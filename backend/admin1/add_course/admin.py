# admin1/add_course/admin.py
from django.contrib import admin
from .models import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    # ✅ CORRECTED: Use 'start_date' to match the model
    list_display = ('name', 'category', 'duration', 'instructor', 'students', 'status', 'start_date', 'branch')