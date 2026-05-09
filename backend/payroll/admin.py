from django.contrib import admin
from .models import PayrollPeriod, PayrollEntry, SalaryAdvance


class PayrollEntryInline(admin.TabularInline):
    model = PayrollEntry
    extra = 0
    fields = ['employee', 'days_worked', 'base_salary', 'total_devengado', 'total_deductions', 'net_pay']


@admin.register(PayrollPeriod)
class PayrollPeriodAdmin(admin.ModelAdmin):
    list_display = ['name', 'period_type', 'start_date', 'end_date', 'status', 'total_neto']
    list_filter = ['status', 'period_type']
    inlines = [PayrollEntryInline]


@admin.register(PayrollEntry)
class PayrollEntryAdmin(admin.ModelAdmin):
    list_display = ['period', 'employee', 'days_worked', 'base_salary', 'total_devengado', 'net_pay']
    list_filter = ['period']


@admin.register(SalaryAdvance)
class SalaryAdvanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'amount', 'request_date', 'status', 'approved_by']
    list_filter = ['status']
