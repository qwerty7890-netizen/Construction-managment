from django.contrib import admin
from .models import DailyLog, LogActivity, LogPersonnel, LogEquipment, LogMaterial, LogIncident


class LogActivityInline(admin.TabularInline):
    model = LogActivity
    extra = 0


class LogPersonnelInline(admin.TabularInline):
    model = LogPersonnel
    extra = 0


class LogEquipmentInline(admin.TabularInline):
    model = LogEquipment
    extra = 0


class LogIncidentInline(admin.TabularInline):
    model = LogIncident
    extra = 0


@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ['project', 'date', 'weather_morning', 'weather_afternoon', 'created_by']
    list_filter = ['project', 'weather_morning']
    date_hierarchy = 'date'
    inlines = [LogActivityInline, LogPersonnelInline, LogEquipmentInline, LogIncidentInline]
