from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, ProjectPhase, ProjectDocument
from .serializers import ProjectSerializer, ProjectListSerializer, ProjectPhaseSerializer, ProjectDocumentSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().select_related('director', 'resident')
    search_fields = ['code', 'name', 'location', 'municipality']
    filterset_fields = ['project_type', 'status', 'municipality', 'department']
    ordering_fields = ['code', 'name', 'start_date', 'contract_value']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        project = self.get_object()
        from logs.models import DailyLog
        from equipment.models import EquipmentAssignment
        from warehouse.models import MaterialExit
        from accounting.models import Expense, Invoice

        data = {
            'project': ProjectSerializer(project).data,
            'total_logs': DailyLog.objects.filter(project=project).count(),
            'active_equipment': EquipmentAssignment.objects.filter(project=project, status='activo').count(),
            'total_expenses': Expense.objects.filter(project=project, status='pagado').aggregate(
                total=__import__('django.db.models', fromlist=['Sum']).Sum('amount')
            )['total'] or 0,
            'total_invoiced': Invoice.objects.filter(project=project).aggregate(
                total=__import__('django.db.models', fromlist=['Sum']).Sum('total')
            )['total'] or 0,
        }
        return Response(data)


class ProjectPhaseViewSet(viewsets.ModelViewSet):
    queryset = ProjectPhase.objects.all()
    filterset_fields = ['project', 'status']
    serializer_class = ProjectPhaseSerializer


class ProjectDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.all()
    filterset_fields = ['project', 'doc_type']
    serializer_class = ProjectDocumentSerializer
