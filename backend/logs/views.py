from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import DailyLog, LogActivity, LogPersonnel, LogEquipment, LogMaterial, LogIncident
from .serializers import (DailyLogSerializer, DailyLogListSerializer, LogActivitySerializer,
                          LogPersonnelSerializer, LogEquipmentSerializer, LogMaterialSerializer, LogIncidentSerializer)


class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all().select_related('project', 'created_by')
    search_fields = ['project__code', 'project__name', 'general_notes']
    filterset_fields = ['project', 'date', 'weather_morning']
    ordering_fields = ['date', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return DailyLogListSerializer
        return DailyLogSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LogActivityViewSet(viewsets.ModelViewSet):
    queryset = LogActivity.objects.all()
    filterset_fields = ['daily_log']
    serializer_class = LogActivitySerializer


class LogPersonnelViewSet(viewsets.ModelViewSet):
    queryset = LogPersonnel.objects.all().select_related('employee')
    filterset_fields = ['daily_log', 'employee']
    serializer_class = LogPersonnelSerializer


class LogEquipmentViewSet(viewsets.ModelViewSet):
    queryset = LogEquipment.objects.all().select_related('equipment', 'operator')
    filterset_fields = ['daily_log', 'equipment']
    serializer_class = LogEquipmentSerializer


class LogMaterialViewSet(viewsets.ModelViewSet):
    queryset = LogMaterial.objects.all().select_related('material')
    filterset_fields = ['daily_log', 'material']
    serializer_class = LogMaterialSerializer


class LogIncidentViewSet(viewsets.ModelViewSet):
    queryset = LogIncident.objects.all()
    filterset_fields = ['daily_log', 'incident_type', 'severity']
    serializer_class = LogIncidentSerializer
