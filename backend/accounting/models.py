from django.db import models
from django.conf import settings


class Account(models.Model):
    TYPE_CHOICES = [
        ('activo', 'Activo'),
        ('pasivo', 'Pasivo'),
        ('patrimonio', 'Patrimonio'),
        ('ingreso', 'Ingreso'),
        ('gasto', 'Gasto'),
        ('costo', 'Costo'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    account_type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='children'
    )
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Cuenta Contable'
        verbose_name_plural = 'Cuentas Contables'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Journal(models.Model):
    STATUS_CHOICES = [
        ('borrador', 'Borrador'),
        ('contabilizado', 'Contabilizado'),
        ('anulado', 'Anulado'),
    ]

    number = models.CharField(max_length=30, unique=True)
    date = models.DateField()
    description = models.CharField(max_length=300)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='borrador')
    project = models.ForeignKey(
        'projects.Project', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='journals'
    )
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Comprobante Contable'
        verbose_name_plural = 'Comprobantes Contables'
        ordering = ['-date']

    def __str__(self):
        return f"{self.number} - {self.description}"


class JournalEntry(models.Model):
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='entries')
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    description = models.CharField(max_length=300)
    debit = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=16, decimal_places=2, default=0)

    class Meta:
        verbose_name = 'Movimiento Contable'
        verbose_name_plural = 'Movimientos Contables'

    def __str__(self):
        return f"{self.journal} - {self.account}"


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada'),
        ('pagada_parcial', 'Pagada Parcialmente'),
        ('pagada', 'Pagada'),
        ('vencida', 'Vencida'),
        ('anulada', 'Anulada'),
    ]
    TYPE_CHOICES = [
        ('factura', 'Factura de Venta'),
        ('anticipo', 'Anticipo'),
        ('acta_cobro', 'Acta de Cobro'),
    ]

    invoice_number = models.CharField(max_length=30, unique=True)
    invoice_type = models.CharField(max_length=15, choices=TYPE_CHOICES, default='factura')
    project = models.ForeignKey(
        'projects.Project', on_delete=models.PROTECT,
        related_name='invoices'
    )
    client = models.ForeignKey(
        'administration.Client', on_delete=models.PROTECT,
        related_name='invoices'
    )
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='borrador')
    subtotal = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=19)
    tax_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    retention = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
        ordering = ['-issue_date']

    def __str__(self):
        return f"{self.invoice_number} - {self.client}"

    @property
    def balance(self):
        return self.total - self.paid_amount


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=300)
    unit = models.CharField(max_length=30, blank=True)
    quantity = models.DecimalField(max_digits=12, decimal_places=3, default=1)
    unit_price = models.DecimalField(max_digits=14, decimal_places=2)
    total = models.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        verbose_name = 'Ítem de Factura'
        verbose_name_plural = 'Ítems de Factura'

    def __str__(self):
        return f"{self.invoice} - {self.description}"


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('materiales', 'Materiales'),
        ('mano_obra', 'Mano de Obra'),
        ('equipos', 'Equipos y Maquinaria'),
        ('combustible', 'Combustible'),
        ('transporte', 'Transporte'),
        ('subcontrato', 'Subcontrato'),
        ('administrativo', 'Gastos Administrativos'),
        ('seguridad', 'Seguridad Industrial'),
        ('otro', 'Otro'),
    ]
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente de Aprobación'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('pagado', 'Pagado'),
    ]

    project = models.ForeignKey(
        'projects.Project', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='expenses'
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=16, decimal_places=2)
    expense_date = models.DateField()
    supplier = models.ForeignKey(
        'warehouse.Supplier', on_delete=models.SET_NULL,
        null=True, blank=True
    )
    invoice_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pendiente')
    receipt = models.FileField(upload_to='expenses/', null=True, blank=True)
    requested_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='expenses_requested'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='expenses_approved'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Gasto'
        verbose_name_plural = 'Gastos'
        ordering = ['-expense_date']

    def __str__(self):
        return f"{self.get_category_display()} - ${self.amount} ({self.expense_date})"


class Budget(models.Model):
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=20, choices=Expense.CATEGORY_CHOICES)
    budgeted_amount = models.DecimalField(max_digits=18, decimal_places=2)
    actual_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Presupuesto'
        verbose_name_plural = 'Presupuestos'
        unique_together = ['project', 'category']

    def __str__(self):
        return f"{self.project} - {self.get_category_display()}"

    @property
    def variance(self):
        return self.budgeted_amount - self.actual_amount

    @property
    def execution_percentage(self):
        if self.budgeted_amount > 0:
            return (self.actual_amount / self.budgeted_amount) * 100
        return 0
