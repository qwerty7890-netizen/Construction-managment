from django.contrib import admin
from .models import Department, Position, Employee, EmployeeDocument


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'base_salary']
    list_filter = ['department']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_code', 'last_name', 'first_name', 'id_number', 'department', 'position', 'status', 'base_salary']
    list_filter = ['department', 'status', 'salary_type']
    search_fields = ['employee_code', 'first_name', 'last_name', 'id_number']


@admin.register(EmployeeDocument)
class EmployeeDocumentAdmin(admin.ModelAdmin):
    list_display = ['employee', 'doc_type', 'name', 'expiry_date']
