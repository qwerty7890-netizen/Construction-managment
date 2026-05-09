from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import PayrollPeriod, PayrollEntry, SalaryAdvance
from .serializers import PayrollPeriodSerializer, PayrollEntrySerializer, SalaryAdvanceSerializer


class PayrollPeriodViewSet(viewsets.ModelViewSet):
    queryset = PayrollPeriod.objects.all()
    filterset_fields = ['status', 'period_type']
    ordering_fields = ['start_date']
    serializer_class = PayrollPeriodSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        period = self.get_object()
        entries = PayrollEntry.objects.filter(period=period)
        totals = entries.aggregate(
            total_devengado=Sum('total_devengado'),
            total_deducciones=Sum('total_deductions'),
            total_neto=Sum('net_pay'),
            total_employer_costs=Sum('employer_health') + Sum('employer_pension') + Sum('arl') + Sum('ccf'),
        )
        return Response({
            'period': PayrollPeriodSerializer(period).data,
            'employee_count': entries.count(),
            **totals,
        })


class PayrollEntryViewSet(viewsets.ModelViewSet):
    queryset = PayrollEntry.objects.all().select_related('employee', 'period')
    filterset_fields = ['period', 'employee']
    serializer_class = PayrollEntrySerializer


class SalaryAdvanceViewSet(viewsets.ModelViewSet):
    queryset = SalaryAdvance.objects.all().select_related('employee')
    filterset_fields = ['employee', 'status']
    ordering_fields = ['request_date']
    serializer_class = SalaryAdvanceSerializer
