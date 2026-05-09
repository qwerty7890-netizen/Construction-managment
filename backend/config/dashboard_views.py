from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta


class DashboardView(APIView):
    def get(self, request):
        from projects.models import Project
        from equipment.models import Equipment
        from personnel.models import Employee
        from warehouse.models import Material
        from accounting.models import Invoice, Expense
        from logs.models import DailyLog, LogIncident

        today = timezone.now().date()
        month_start = today.replace(day=1)

        projects_by_status = list(Project.objects.values('status').annotate(count=Count('id')))
        active_projects = Project.objects.filter(status='en_ejecucion').count()
        total_contract_value = Project.objects.filter(
            status='en_ejecucion'
        ).aggregate(total=Sum('contract_value'))['total'] or 0

        equipment_by_status = list(Equipment.objects.values('status').annotate(count=Count('id')))

        active_employees = Employee.objects.filter(status='activo').count()

        low_stock_count = Material.objects.filter(
            is_active=True, current_stock__lte=F('minimum_stock')
        ).count()

        monthly_invoiced = Invoice.objects.filter(
            issue_date__gte=month_start
        ).aggregate(total=Sum('total'))['total'] or 0

        monthly_expenses = Expense.objects.filter(
            expense_date__gte=month_start, status='pagado'
        ).aggregate(total=Sum('amount'))['total'] or 0

        overdue_invoices = Invoice.objects.filter(
            due_date__lt=today, status__in=['enviada', 'pagada_parcial']
        ).count()

        recent_logs = DailyLog.objects.filter(
            date__gte=today - timedelta(days=7)
        ).select_related('project').order_by('-date')[:10]

        recent_incidents = LogIncident.objects.filter(
            daily_log__date__gte=today - timedelta(days=30)
        ).select_related('daily_log__project').order_by('-daily_log__date')[:5]

        return Response({
            'projects': {
                'active': active_projects,
                'by_status': projects_by_status,
                'total_contract_value': float(total_contract_value),
            },
            'equipment': {
                'by_status': equipment_by_status,
            },
            'personnel': {
                'active_employees': active_employees,
            },
            'warehouse': {
                'low_stock_count': low_stock_count,
            },
            'financial': {
                'monthly_invoiced': float(monthly_invoiced),
                'monthly_expenses': float(monthly_expenses),
                'overdue_invoices': overdue_invoices,
            },
            'recent_logs': [
                {'id': log.id, 'project': log.project.name, 'project_code': log.project.code, 'date': str(log.date)}
                for log in recent_logs
            ],
            'recent_incidents': [
                {'id': inc.id, 'project': inc.daily_log.project.name,
                 'type': inc.get_incident_type_display(), 'severity': inc.severity,
                 'date': str(inc.daily_log.date)}
                for inc in recent_incidents
            ],
        })
