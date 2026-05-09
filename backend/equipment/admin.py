from django.contrib import admin
from .models import Equipment, EquipmentAssignment, EquipmentMaintenance, FuelLog


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'equipment_type', 'brand', 'model', 'plate', 'status', 'ownership']
    list_filter = ['equipment_type', 'status', 'ownership']
    search_fields = ['code', 'name', 'plate', 'serial_number']


@admin.register(EquipmentAssignment)
class EquipmentAssignmentAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'project', 'operator', 'start_date', 'end_date', 'status']
    list_filter = ['status']


@admin.register(EquipmentMaintenance)
class EquipmentMaintenanceAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'maintenance_type', 'scheduled_date', 'status', 'cost']
    list_filter = ['maintenance_type', 'status']


@admin.register(FuelLog)
class FuelLogAdmin(admin.ModelAdmin):
    list_display = ['equipment', 'date', 'gallons', 'total_cost', 'project']
    list_filter = ['equipment', 'project']
