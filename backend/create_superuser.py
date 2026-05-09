"""
Script para crear superusuario inicial.
Ejecutar con: python create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@constructora.com',
        password='Admin2024!',
        first_name='Administrador',
        last_name='Sistema',
        role='admin'
    )
    print("Superusuario creado: admin / Admin2024!")
else:
    print("El superusuario ya existe.")
