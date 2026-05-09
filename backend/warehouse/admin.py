from django.contrib import admin
from .models import MaterialCategory, Material, Supplier, PurchaseOrder, PurchaseOrderItem, MaterialEntry, MaterialExit


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 0


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'category', 'unit', 'current_stock', 'minimum_stock', 'unit_price']
    list_filter = ['category', 'is_active']
    search_fields = ['code', 'name']


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'nit', 'contact_person', 'phone', 'city', 'is_active']
    list_filter = ['is_active', 'city']
    search_fields = ['name', 'nit']


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'supplier', 'project', 'order_date', 'status', 'total']
    list_filter = ['status']
    inlines = [PurchaseOrderItemInline]


@admin.register(MaterialEntry)
class MaterialEntryAdmin(admin.ModelAdmin):
    list_display = ['material', 'quantity', 'date', 'supplier', 'received_by']


@admin.register(MaterialExit)
class MaterialExitAdmin(admin.ModelAdmin):
    list_display = ['material', 'quantity', 'date', 'project', 'authorized_by']
