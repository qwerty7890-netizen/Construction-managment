from django.db import models
from django.conf import settings


class DailyLog(models.Model):
    WEATHER_CHOICES = [
        ('soleado', 'Soleado'),
        ('nublado', 'Nublado'),
        ('lluvia_leve', 'Lluvia Leve'),
        ('lluvia_fuerte', 'Lluvia Fuerte'),
        ('tormenta', 'Tormenta'),
    ]

    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    weather_morning = models.CharField(max_length=20, choices=WEATHER_CHOICES, default='soleado')
    weather_afternoon = models.CharField(max_length=20, choices=WEATHER_CHOICES, default='soleado')
    temperature_min = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    temperature_max = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    general_notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Bitácora Diaria'
        verbose_name_plural = 'Bitácoras Diarias'
        unique_together = ['project', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"Bitácora {self.project.code} - {self.date}"


class LogActivity(models.Model):
    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='activities')
    description = models.CharField(max_length=300)
    location = models.CharField(max_length=200, blank=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=30, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    progress_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    observations = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Actividad de Bitácora'
        verbose_name_plural = 'Actividades de Bitácora'

    def __str__(self):
        return f"{self.daily_log} - {self.description[:50]}"


class LogPersonnel(models.Model):
    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='personnel_entries')
    employee = models.ForeignKey('personnel.Employee', on_delete=models.PROTECT)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=8)
    extra_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    task = models.CharField(max_length=200)
    observations = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Personal en Bitácora'
        verbose_name_plural = 'Personal en Bitácoras'

    def __str__(self):
        return f"{self.daily_log} - {self.employee}"


class LogEquipment(models.Model):
    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='equipment_entries')
    equipment = models.ForeignKey('equipment.Equipment', on_delete=models.PROTECT)
    operator = models.ForeignKey(
        'personnel.Employee', on_delete=models.SET_NULL,
        null=True, blank=True
    )
    hours_operated = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    hours_idle = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    activity = models.CharField(max_length=300)
    initial_hourmeter = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    final_hourmeter = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    fuel_consumed = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    observations = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Equipo en Bitácora'
        verbose_name_plural = 'Equipos en Bitácoras'

    def __str__(self):
        return f"{self.daily_log} - {self.equipment}"


class LogMaterial(models.Model):
    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='material_entries')
    material = models.ForeignKey('warehouse.Material', on_delete=models.PROTECT)
    quantity_used = models.DecimalField(max_digits=12, decimal_places=3)
    unit = models.CharField(max_length=30)
    activity = models.CharField(max_length=200, blank=True)
    observations = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Material en Bitácora'
        verbose_name_plural = 'Materiales en Bitácoras'

    def __str__(self):
        return f"{self.daily_log} - {self.material}"


class LogIncident(models.Model):
    SEVERITY_CHOICES = [
        ('leve', 'Leve'),
        ('moderado', 'Moderado'),
        ('grave', 'Grave'),
        ('critico', 'Crítico'),
    ]
    TYPE_CHOICES = [
        ('accidente', 'Accidente de Trabajo'),
        ('incidente', 'Incidente'),
        ('casi_accidente', 'Casi Accidente'),
        ('seguridad', 'Seguridad Industrial'),
        ('ambiental', 'Ambiental'),
        ('calidad', 'Calidad'),
        ('otro', 'Otro'),
    ]

    daily_log = models.ForeignKey(DailyLog, on_delete=models.CASCADE, related_name='incidents')
    incident_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    description = models.TextField()
    location = models.CharField(max_length=200)
    persons_involved = models.TextField(blank=True)
    immediate_actions = models.TextField(blank=True)
    reported_to = models.CharField(max_length=200, blank=True)
    time = models.TimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Incidente en Bitácora'
        verbose_name_plural = 'Incidentes en Bitácoras'

    def __str__(self):
        return f"{self.daily_log} - {self.get_incident_type_display()}"
