from django.db import models
from django.conf import settings


class PayrollPeriod(models.Model):
    STATUS_CHOICES = [
        ('abierto', 'Abierto'),
        ('procesando', 'Procesando'),
        ('cerrado', 'Cerrado'),
        ('pagado', 'Pagado'),
    ]
    PERIOD_TYPE_CHOICES = [
        ('quincenal', 'Quincenal'),
        ('mensual', 'Mensual'),
    ]

    name = models.CharField(max_length=100)
    period_type = models.CharField(max_length=10, choices=PERIOD_TYPE_CHOICES, default='mensual')
    start_date = models.DateField()
    end_date = models.DateField()
    payment_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='abierto')
    total_devengado = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    total_deducciones = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    total_neto = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Período de Nómina'
        verbose_name_plural = 'Períodos de Nómina'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"


class PayrollEntry(models.Model):
    period = models.ForeignKey(PayrollPeriod, on_delete=models.CASCADE, related_name='entries')
    employee = models.ForeignKey('personnel.Employee', on_delete=models.PROTECT, related_name='payroll_entries')
    days_worked = models.DecimalField(max_digits=5, decimal_places=2, default=30)
    regular_hours = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    extra_hours_day = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    extra_hours_night = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    extra_hours_holiday = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    # Devengado
    base_salary = models.DecimalField(max_digits=14, decimal_places=2)
    transportation_allowance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    extra_pay = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    vacation_pay = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_devengado = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    # Deducciones
    health_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    pension_deduction = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    advances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_deductions = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    # Neto
    net_pay = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    # Aportes patronales
    employer_health = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    employer_pension = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    arl = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    ccf = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    icbf = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sena = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Entrada de Nómina'
        verbose_name_plural = 'Entradas de Nómina'
        unique_together = ['period', 'employee']

    def __str__(self):
        return f"{self.period} - {self.employee}"


class SalaryAdvance(models.Model):
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('descontado', 'Descontado'),
    ]

    employee = models.ForeignKey('personnel.Employee', on_delete=models.PROTECT, related_name='advances')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    request_date = models.DateField()
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pendiente')
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    payroll_entry = models.ForeignKey(
        PayrollEntry, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='salary_advances'
    )
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Anticipo de Salario'
        verbose_name_plural = 'Anticipos de Salario'

    def __str__(self):
        return f"{self.employee} - ${self.amount} ({self.request_date})"
