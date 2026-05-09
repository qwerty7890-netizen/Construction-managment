from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Equipment, EquipmentAssignment, EquipmentMaintenance, FuelLog
from .serializers import (EquipmentSerializer, EquipmentAssignmentSerializer,
                          EquipmentMaintenanceSerializer, FuelLogSerializer)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    search_fields = ['code', 'name', 'plate', 'serial_number', 'brand', 'model']
    filterset_fields = ['equipment_type', 'status', 'ownership']
    ordering_fields = ['code', 'name', 'status']
    serializer_class = EquipmentSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        equipment = self.get_object()
        assignments = EquipmentAssignment.objects.filter(equipment=equipment)
        maintenances = EquipmentMaintenance.objects.filter(equipment=equipment)
        fuel = FuelLog.objects.filter(equipment=equipment).aggregate(total=Sum('gallons'))
        return Response({
            'assignments': EquipmentAssignmentSerializer(assignments, many=True).data,
            'maintenances': EquipmentMaintenanceSerializer(maintenances, many=True).data,
            'total_fuel_gallons': fuel['total'] or 0,
        })


class EquipmentAssignmentViewSet(viewsets.ModelViewSet):
    queryset = EquipmentAssignment.objects.all().select_related('equipment', 'project', 'operator')
    filterset_fields = ['equipment', 'project', 'status']
    serializer_class = EquipmentAssignmentSerializer


class EquipmentMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = EquipmentMaintenance.objects.all().select_related('equipment')
    filterset_fields = ['equipment', 'maintenance_type', 'status']
    ordering_fields = ['scheduled_date', 'completion_date']
    serializer_class = EquipmentMaintenanceSerializer


class FuelLogViewSet(viewsets.ModelViewSet):
    queryset = FuelLog.objects.all().select_related('equipment', 'project')
    filterset_fields = ['equipment', 'project', 'date']
    ordering_fields = ['date']
    serializer_class = FuelLogSerializer
