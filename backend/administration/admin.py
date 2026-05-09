from django.contrib import admin
from .models import Client, Contractor, Contract, ContractAddendum


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ['name', 'client_type', 'nit', 'contact_person', 'city', 'is_active']
    list_filter = ['client_type', 'is_active', 'city']
    search_fields = ['name', 'nit']


@admin.register(Contractor)
class ContractorAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialty', 'nit', 'contact_person', 'city', 'is_active']
    list_filter = ['specialty', 'is_active']
    search_fields = ['name', 'nit']


class ContractAddendumInline(admin.TabularInline):
    model = ContractAddendum
    extra = 0


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ['contract_number', 'contract_type', 'project', 'client', 'contractor', 'value', 'status']
    list_filter = ['contract_type', 'status']
    search_fields = ['contract_number']
    inlines = [ContractAddendumInline]
