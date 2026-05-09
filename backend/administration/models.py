from django.db import models
from django.conf import settings


class Client(models.Model):
    TYPE_CHOICES = [
        ('publico', 'Entidad Pública'),
        ('privado', 'Empresa Privada'),
        ('persona_natural', 'Persona Natural'),
    ]

    name = models.CharField(max_length=200)
    client_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    nit = models.CharField(max_length=20, unique=True)
    contact_person = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'

    def __str__(self):
        return f"{self.name} ({self.nit})"


class Contractor(models.Model):
    SPECIALTY_CHOICES = [
        ('concreto', 'Concreto y Estructuras'),
        ('electricidad', 'Electricidad'),
        ('plomeria', 'Plomería e Hidrosanitaria'),
        ('movimiento_tierras', 'Movimiento de Tierras'),
        ('pavimento', 'Pavimentación'),
        ('geotecnia', 'Geotecnia'),
        ('topografia', 'Topografía'),
        ('acabados', 'Acabados'),
        ('prefabricados', 'Prefabricados'),
        ('otro', 'Otro'),
    ]

    name = models.CharField(max_length=200)
    nit = models.CharField(max_length=20, unique=True)
    specialty = models.CharField(max_length=20, choices=SPECIALTY_CHOICES)
    contact_person = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    ruc = models.CharField(max_length=30, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contratista'
        verbose_name_plural = 'Contratistas'

    def __str__(self):
        return f"{self.name} ({self.get_specialty_display()})"


class Contract(models.Model):
    TYPE_CHOICES = [
        ('principal', 'Contrato Principal (Cliente)'),
        ('subcontrato', 'Subcontrato (Contratista)'),
        ('suministro', 'Contrato de Suministro'),
        ('servicio', 'Contrato de Servicio'),
    ]
    STATUS_CHOICES = [
        ('borrador', 'Borrador'),
        ('revision', 'En Revisión'),
        ('firmado', 'Firmado'),
        ('en_ejecucion', 'En Ejecución'),
        ('terminado', 'Terminado'),
        ('liquidado', 'Liquidado'),
        ('anulado', 'Anulado'),
    ]

    contract_number = models.CharField(max_length=50, unique=True)
    contract_type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    project = models.ForeignKey('projects.Project', on_delete=models.PROTECT, related_name='contracts')
    client = models.ForeignKey(
        Client, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='contracts'
    )
    contractor = models.ForeignKey(
        Contractor, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='contracts'
    )
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=18, decimal_places=2)
    advance_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    retention_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='borrador')
    contract_file = models.FileField(upload_to='contracts/', null=True, blank=True)
    signed_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contrato'
        verbose_name_plural = 'Contratos'
        ordering = ['-created_at']

    def __str__(self):
        party = self.client or self.contractor
        return f"{self.contract_number} - {party}"


class ContractAddendum(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='addenda')
    number = models.IntegerField()
    description = models.TextField()
    value_change = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    days_change = models.IntegerField(default=0)
    signed_date = models.DateField()
    file = models.FileField(upload_to='contracts/addenda/', null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Otrosí / Adición'
        verbose_name_plural = 'Otrosíes / Adiciones'
        unique_together = ['contract', 'number']

    def __str__(self):
        return f"{self.contract} - Otrosí #{self.number}"
