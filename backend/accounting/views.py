from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from .models import Account, Journal, JournalEntry, Invoice, InvoiceItem, Expense, Budget
from .serializers import (AccountSerializer, JournalSerializer, JournalEntrySerializer,
                          InvoiceSerializer, InvoiceItemSerializer, ExpenseSerializer, BudgetSerializer)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.filter(parent=None)
    search_fields = ['code', 'name']
    filterset_fields = ['account_type', 'is_active']
    serializer_class = AccountSerializer


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all().select_related('project', 'created_by')
    search_fields = ['number', 'description']
    filterset_fields = ['status', 'project', 'date']
    ordering_fields = ['date', 'number']
    serializer_class = JournalSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().select_related('project', 'client')
    search_fields = ['invoice_number', 'client__name', 'project__name']
    filterset_fields = ['status', 'project', 'client', 'invoice_type']
    ordering_fields = ['issue_date', 'due_date', 'total']
    serializer_class = InvoiceSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        from django.utils import timezone
        overdue = Invoice.objects.filter(
            due_date__lt=timezone.now().date(),
            status__in=['enviada', 'pagada_parcial']
        )
        return Response(InvoiceSerializer(overdue, many=True).data)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().select_related('project', 'supplier')
    search_fields = ['description', 'invoice_number']
    filterset_fields = ['project', 'category', 'status']
    ordering_fields = ['expense_date', 'amount']
    serializer_class = ExpenseSerializer

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    filterset_fields = ['project', 'category']
    serializer_class = BudgetSerializer
