from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('gerente', 'Gerente'),
        ('director_obra', 'Director de Obra'),
        ('residente', 'Residente de Obra'),
        ('almacenista', 'Almacenista'),
        ('contador', 'Contador'),
        ('rrhh', 'Recursos Humanos'),
        ('operador', 'Operador de Equipo'),
        ('conductor', 'Conductor'),
        ('visor', 'Solo Lectura'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visor')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
