from django.contrib import admin
from .models import Account, Journal, JournalEntry, Invoice, InvoiceItem, Expense, Budget


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'account_type', 'parent', 'is_active']
    list_filter = ['account_type', 'is_active']
    search_fields = ['code', 'name']


class JournalEntryInline(admin.TabularInline):
    model = JournalEntry
    extra = 0


@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ['number', 'date', 'description', 'status', 'project']
    list_filter = ['status']
    inlines = [JournalEntryInline]


class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'client', 'project', 'issue_date', 'due_date', 'status', 'total', 'paid_amount']
    list_filter = ['status', 'invoice_type']
    search_fields = ['invoice_number', 'client__name']
    inlines = [InvoiceItemInline]


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'category', 'amount', 'expense_date', 'project', 'status']
    list_filter = ['category', 'status', 'project']


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ['project', 'category', 'budgeted_amount', 'actual_amount']
    list_filter = ['project', 'category']
