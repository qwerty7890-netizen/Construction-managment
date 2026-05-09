from rest_framework import serializers
from .models import Equipment, EquipmentAssignment, EquipmentMaintenance, FuelLog


class EquipmentSerializer(serializers.ModelSerializer):
    equipment_type_display = serializers.CharField(source='get_equipment_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Equipment
        fields = '__all__'


class EquipmentAssignmentSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    operator_name = serializers.CharField(source='operator.full_name', read_only=True)

    class Meta:
        model = EquipmentAssignment
        fields = '__all__'


class EquipmentMaintenanceSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    maintenance_type_display = serializers.CharField(source='get_maintenance_type_display', read_only=True)

    class Meta:
        model = EquipmentMaintenance
        fields = '__all__'


class FuelLogSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)

    class Meta:
        model = FuelLog
        fields = '__all__'
