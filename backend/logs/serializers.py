from rest_framework import serializers
from .models import DailyLog, LogActivity, LogPersonnel, LogEquipment, LogMaterial, LogIncident


class LogActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogActivity
        fields = '__all__'


class LogPersonnelSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = LogPersonnel
        fields = '__all__'


class LogEquipmentSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)
    equipment_code = serializers.CharField(source='equipment.code', read_only=True)
    operator_name = serializers.CharField(source='operator.full_name', read_only=True)

    class Meta:
        model = LogEquipment
        fields = '__all__'


class LogMaterialSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source='material.name', read_only=True)
    material_code = serializers.CharField(source='material.code', read_only=True)

    class Meta:
        model = LogMaterial
        fields = '__all__'


class LogIncidentSerializer(serializers.ModelSerializer):
    incident_type_display = serializers.CharField(source='get_incident_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)

    class Meta:
        model = LogIncident
        fields = '__all__'


class DailyLogSerializer(serializers.ModelSerializer):
    activities = LogActivitySerializer(many=True, read_only=True)
    personnel_entries = LogPersonnelSerializer(many=True, read_only=True)
    equipment_entries = LogEquipmentSerializer(many=True, read_only=True)
    material_entries = LogMaterialSerializer(many=True, read_only=True)
    incidents = LogIncidentSerializer(many=True, read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_code = serializers.CharField(source='project.code', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = DailyLog
        fields = '__all__'


class DailyLogListSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_code = serializers.CharField(source='project.code', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    activities_count = serializers.IntegerField(source='activities.count', read_only=True)
    incidents_count = serializers.IntegerField(source='incidents.count', read_only=True)

    class Meta:
        model = DailyLog
        fields = ['id', 'project', 'project_name', 'project_code', 'date',
                  'weather_morning', 'weather_afternoon', 'general_notes',
                  'created_by_name', 'created_at', 'activities_count', 'incidents_count']
