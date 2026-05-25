from rest_framework import serializers
from .models import Project, ProjectPhase, ProjectDocument


class ProjectPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectPhase
        fields = '__all__'


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    phases = ProjectPhaseSerializer(many=True, read_only=True)
    project_type_display = serializers.CharField(source='get_project_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    director_name = serializers.CharField(source='director.get_full_name', read_only=True)
    resident_name = serializers.SerializerMethodField()

    def get_resident_name(self, obj):
        return obj.resident.get_full_name() if obj.resident else None

    class Meta:
        model = Project
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    project_type_display = serializers.CharField(source='get_project_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    director_name = serializers.CharField(source='director.get_full_name', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'code', 'name', 'project_type', 'project_type_display', 'status', 'status_display',
                  'location', 'municipality', 'start_date', 'end_date', 'contract_value',
                  'advance_percentage', 'director_name']
