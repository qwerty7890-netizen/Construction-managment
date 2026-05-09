from django.contrib import admin
from .models import Project, ProjectPhase, ProjectDocument


class ProjectPhaseInline(admin.TabularInline):
    model = ProjectPhase
    extra = 0


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'project_type', 'status', 'municipality', 'contract_value', 'start_date', 'end_date']
    list_filter = ['project_type', 'status', 'department']
    search_fields = ['code', 'name', 'location', 'municipality']
    inlines = [ProjectPhaseInline]


@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ['project', 'doc_type', 'name', 'uploaded_by', 'uploaded_at']
    list_filter = ['doc_type']
