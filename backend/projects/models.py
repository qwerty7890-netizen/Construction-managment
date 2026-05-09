from django.db import models
from django.conf import settings


class Project(models.Model):
    TYPE_CHOICES = [
        ('vias', 'Construcción de Vías'),
        ('movimiento_tierras', 'Movimiento de Tierras'),
        ('infraestructura', 'Infraestructura'),
        ('residencial', 'Edificación Residencial'),
        ('comercial', 'Edificación Comercial'),
        ('mixto', 'Proyecto Mixto'),
    ]
    STATUS_CHOICES = [
        ('licitacion', 'En Licitación'),
        ('adjudicado', 'Adjudicado'),
        ('en_ejecucion', 'En Ejecución'),
        ('suspendido', 'Suspendido'),
        ('terminado', 'Terminado'),
        ('liquidado', 'Liquidado'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    project_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='adjudicado')
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200)
    municipality = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    contract_value = models.DecimalField(max_digits=18, decimal_places=2)
    advance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    director = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='directed_projects'
    )
    resident = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='resident_projects'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} - {self.name}"


class ProjectPhase(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_ejecucion', 'En Ejecución'),
        ('terminada', 'Terminada'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    budget = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    progress = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        verbose_name = 'Fase de Proyecto'
        verbose_name_plural = 'Fases de Proyecto'

    def __str__(self):
        return f"{self.project.code} - {self.name}"


class ProjectDocument(models.Model):
    TYPE_CHOICES = [
        ('contrato', 'Contrato'),
        ('plano', 'Plano'),
        ('especificacion', 'Especificación Técnica'),
        ('acta', 'Acta'),
        ('informe', 'Informe'),
        ('permiso', 'Permiso/Licencia'),
        ('otro', 'Otro'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='projects/documents/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Documento de Proyecto'
        verbose_name_plural = 'Documentos de Proyecto'

    def __str__(self):
        return f"{self.project.code} - {self.name}"
