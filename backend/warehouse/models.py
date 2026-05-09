from django.db import models
from django.conf import settings


class MaterialCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Categoría de Material'
        verbose_name_plural = 'Categorías de Materiales'

    def __str__(self):
        return self.name


class Material(models.Model):
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(MaterialCategory, on_delete=models.SET_NULL, null=True, related_name='materials')
    unit = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    current_stock = models.DecimalField(max_digits=14, decimal_places=3, default=0)
    minimum_stock = models.DecimalField(max_digits=14, decimal_places=3, default=0)
    maximum_stock = models.DecimalField(max_digits=14, decimal_places=3, null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Material'
        verbose_name_plural = 'Materiales'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"

    @property
    def is_low_stock(self):
        return self.current_stock <= self.minimum_stock


class Supplier(models.Model):
    name = models.CharField(max_length=200)
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
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'

    def __str__(self):
        return f"{self.name} ({self.nit})"


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('borrador', 'Borrador'),
        ('enviada', 'Enviada al Proveedor'),
        ('aprobada', 'Aprobada'),
        ('recibida_parcial', 'Recibida Parcialmente'),
        ('recibida', 'Recibida Completa'),
        ('cancelada', 'Cancelada'),
    ]

    order_number = models.CharField(max_length=30, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    project = models.ForeignKey(
        'projects.Project', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='purchase_orders'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='borrador')
    order_date = models.DateField()
    expected_delivery = models.DateField(null=True, blank=True)
    delivery_address = models.CharField(max_length=300, blank=True)
    subtotal = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=19)
    tax_amount = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Orden de Compra'
        verbose_name_plural = 'Órdenes de Compra'
        ordering = ['-created_at']

    def __str__(self):
        return f"OC-{self.order_number} ({self.supplier})"


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    material = models.ForeignKey(Material, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    unit_price = models.DecimalField(max_digits=14, decimal_places=2)
    total = models.DecimalField(max_digits=16, decimal_places=2)
    quantity_received = models.DecimalField(max_digits=12, decimal_places=3, default=0)

    class Meta:
        verbose_name = 'Ítem de Orden de Compra'
        verbose_name_plural = 'Ítems de Orden de Compra'

    def __str__(self):
        return f"{self.purchase_order} - {self.material}"


class MaterialEntry(models.Model):
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='entries')
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    unit_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    date = models.DateField()
    purchase_order = models.ForeignKey(
        PurchaseOrder, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='material_entries'
    )
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    invoice_number = models.CharField(max_length=50, blank=True)
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='material_entries'
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Entrada de Material'
        verbose_name_plural = 'Entradas de Material'
        ordering = ['-date']

    def __str__(self):
        return f"Entrada {self.material} - {self.date} ({self.quantity})"


class MaterialExit(models.Model):
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='exits')
    quantity = models.DecimalField(max_digits=12, decimal_places=3)
    date = models.DateField()
    project = models.ForeignKey(
        'projects.Project', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='material_exits'
    )
    reason = models.CharField(max_length=300)
    authorized_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='material_exits_authorized'
    )
    daily_log = models.ForeignKey(
        'logs.DailyLog', on_delete=models.SET_NULL,
        null=True, blank=True
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Salida de Material'
        verbose_name_plural = 'Salidas de Material'
        ordering = ['-date']

    def __str__(self):
        return f"Salida {self.material} - {self.date} ({self.quantity})"
