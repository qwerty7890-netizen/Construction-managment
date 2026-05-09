from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'

    def __str__(self):
        return self.name


class Position(models.Model):
    name = models.CharField(max_length=150)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='positions')
    description = models.TextField(blank=True)
    base_salary = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'

    def __str__(self):
        return f"{self.name} - {self.department}"


class Employee(models.Model):
    STATUS_CHOICES = [
        ('activo', 'Activo'),
        ('vacaciones', 'En Vacaciones'),
        ('licencia', 'En Licencia'),
        ('incapacidad', 'En Incapacidad'),
        ('retirado', 'Retirado'),
    ]
    SALARY_TYPE_CHOICES = [
        ('fijo', 'Salario Fijo'),
        ('variable', 'Salario Variable'),
        ('jornal', 'Jornal'),
        ('honorarios', 'Honorarios'),
    ]
    ID_TYPE_CHOICES = [
        ('cc', 'Cédula de Ciudadanía'),
        ('ce', 'Cédula de Extranjería'),
        ('pasaporte', 'Pasaporte'),
        ('nit', 'NIT'),
    ]
    BLOOD_TYPE_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-'),
    ]

    employee_code = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    id_type = models.CharField(max_length=15, choices=ID_TYPE_CHOICES, default='cc')
    id_number = models.CharField(max_length=30, unique=True)
    birth_date = models.DateField(null=True, blank=True)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    emergency_contact = models.CharField(max_length=150, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, related_name='employees')
    hire_date = models.DateField()
    termination_date = models.DateField(null=True, blank=True)
    salary_type = models.CharField(max_length=15, choices=SALARY_TYPE_CHOICES, default='fijo')
    base_salary = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='activo')
    eps = models.CharField(max_length=100, blank=True)
    arl = models.CharField(max_length=100, blank=True)
    pension_fund = models.CharField(max_length=100, blank=True)
    photo = models.ImageField(upload_to='employees/', null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Empleado'
        verbose_name_plural = 'Empleados'
        ordering = ['last_name', 'first_name']

    def __str__(self):
        return f"{self.employee_code} - {self.last_name} {self.first_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class EmployeeDocument(models.Model):
    TYPE_CHOICES = [
        ('contrato', 'Contrato de Trabajo'),
        ('cedula', 'Cédula'),
        ('hoja_vida', 'Hoja de Vida'),
        ('certificado', 'Certificado'),
        ('examen_medico', 'Examen Médico'),
        ('otro', 'Otro'),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='employees/documents/')
    expiry_date = models.DateField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Documento de Empleado'
        verbose_name_plural = 'Documentos de Empleados'

    def __str__(self):
        return f"{self.employee} - {self.name}"
