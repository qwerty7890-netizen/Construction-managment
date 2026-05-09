from django.db import models
from django.conf import settings


class Equipment(models.Model):
    TYPE_CHOICES = [
        ('excavadora', 'Excavadora'),
        ('bulldozer', 'Bulldózer'),
        ('motoniveladora', 'Motoniveladora'),
        ('compactador', 'Compactador/Vibrocompactador'),
        ('retroexcavadora', 'Retroexcavadora'),
        ('cargador', 'Cargador Frontal'),
        ('grua', 'Grúa'),
        ('concretera', 'Concretera/Mezcladora'),
        ('bomba_concreto', 'Bomba de Concreto'),
        ('camion_volqueta', 'Camión Volqueta'),
        ('camion_cisterna', 'Camión Cisterna'),
        ('camion_mixer', 'Camión Mixer'),
        ('camion_plataforma', 'Camión Plataforma'),
        ('camioneta', 'Camioneta'),
        ('otro', 'Otro'),
    ]
    STATUS_CHOICES = [
        ('disponible', 'Disponible'),
        ('asignado', 'Asignado'),
        ('mantenimiento', 'En Mantenimiento'),
        ('dañado', 'Dañado'),
        ('inactivo', 'Inactivo'),
    ]
    OWNERSHIP_CHOICES = [
        ('propio', 'Propio'),
        ('alquilado', 'Alquilado'),
        ('leasing', 'Leasing'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)
    equipment_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField(null=True, blank=True)
    serial_number = models.CharField(max_length=100, blank=True)
    plate = models.CharField(max_length=20, blank=True)
    capacity = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='disponible')
    ownership = models.CharField(max_length=10, choices=OWNERSHIP_CHOICES, default='propio')
    purchase_date = models.DateField(null=True, blank=True)
    purchase_value = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True)
    current_hourmeter = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    current_mileage = models.DecimalField(max_digits=12, decimal_places=1, default=0)
    fuel_type = models.CharField(max_length=20, blank=True)
    insurance_expiry = models.DateField(null=True, blank=True)
    technical_review_expiry = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    photo = models.ImageField(upload_to='equipment/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Equipo'
        verbose_name_plural = 'Equipos'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name} ({self.plate or self.serial_number})"


class EquipmentAssignment(models.Model):
    STATUS_CHOICES = [
        ('activo', 'Activo'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado'),
    ]

    equipment = models.ForeignKey(Equipment, on_delete=models.PROTECT, related_name='assignments')
    project = models.ForeignKey('projects.Project', on_delete=models.PROTECT, related_name='equipment_assignments')
    operator = models.ForeignKey(
        'personnel.Employee', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='equipment_assignments'
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='activo')
    daily_rate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='equipment_assignments_made'
    )

    class Meta:
        verbose_name = 'Asignación de Equipo'
        verbose_name_plural = 'Asignaciones de Equipo'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.equipment} → {self.project}"


class EquipmentMaintenance(models.Model):
    TYPE_CHOICES = [
        ('preventivo', 'Preventivo'),
        ('correctivo', 'Correctivo'),
        ('predictivo', 'Predictivo'),
        ('cambio_aceite', 'Cambio de Aceite'),
        ('revision_general', 'Revisión General'),
    ]
    STATUS_CHOICES = [
        ('programado', 'Programado'),
        ('en_proceso', 'En Proceso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='maintenances')
    maintenance_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='programado')
    scheduled_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    description = models.TextField()
    performed_by = models.CharField(max_length=200, blank=True)
    cost = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    hourmeter_at_maintenance = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    next_maintenance_hourmeter = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    next_maintenance_date = models.DateField(null=True, blank=True)
    parts_replaced = models.TextField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Mantenimiento de Equipo'
        verbose_name_plural = 'Mantenimientos de Equipo'
        ordering = ['-scheduled_date']

    def __str__(self):
        return f"{self.equipment} - {self.get_maintenance_type_display()} ({self.scheduled_date})"


class FuelLog(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='fuel_logs')
    date = models.DateField()
    gallons = models.DecimalField(max_digits=8, decimal_places=2)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=14, decimal_places=2)
    hourmeter = models.DecimalField(max_digits=10, decimal_places=1, null=True, blank=True)
    mileage = models.DecimalField(max_digits=12, decimal_places=1, null=True, blank=True)
    fuel_station = models.CharField(max_length=150, blank=True)
    project = models.ForeignKey(
        'projects.Project', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='fuel_logs'
    )
    filled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='fuel_logs_filled'
    )
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Registro de Combustible'
        verbose_name_plural = 'Registros de Combustible'
        ordering = ['-date']

    def __str__(self):
        return f"{self.equipment} - {self.date} ({self.gallons} gal)"
