# ConstruGestión - Sistema de Gestión de Constructora

Sistema empresarial completo para la gestión de constructoras. Maneja todos los aspectos del negocio: proyectos, bitácoras, equipos, almacén, personal, nómina, contabilidad y administración.

## Módulos

| Módulo | Descripción |
|--------|------------|
| **Proyectos** | Gestión de proyectos (vías, movimiento de tierras, infraestructura, residencial, comercial) |
| **Bitácoras** | Registro diario de actividades, personal, equipos, materiales e incidentes |
| **Equipos** | Control de maquinaria pesada y camiones, mantenimientos y combustible |
| **Almacén** | Inventario de materiales, órdenes de compra, entradas y salidas |
| **Personal** | Empleados, cargos y departamentos |
| **Nómina** | Períodos de nómina, liquidaciones y anticipos |
| **Contabilidad** | Plan de cuentas, comprobantes, facturas y gastos |
| **Administración** | Clientes, contratistas y contratos |

## Stack Tecnológico

- **Backend**: Python 3.12 + Django 5 + Django REST Framework
- **Base de Datos**: PostgreSQL 16
- **Autenticación**: JWT (djangorestframework-simplejwt)
- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS v4
- **Estado**: Zustand + TanStack Query

## Inicio Rápido

### Con Docker Compose (recomendado)

```bash
docker compose up -d
```

El sistema estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/
- Documentación API: http://localhost:8000/api/docs/

### Desarrollo Local

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar base de datos (PostgreSQL requerido)
cp .env.example .env
# Editar .env con sus credenciales

python manage.py migrate
python create_superuser.py  # Crea admin / Admin2024!
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `Admin2024!` |

## API REST

Todos los endpoints siguen el patrón RESTful:

```
GET    /api/{módulo}/{recurso}/          # Listar
POST   /api/{módulo}/{recurso}/          # Crear
GET    /api/{módulo}/{recurso}/{id}/     # Detalle
PUT    /api/{módulo}/{recurso}/{id}/     # Actualizar completo
PATCH  /api/{módulo}/{recurso}/{id}/     # Actualizar parcial
DELETE /api/{módulo}/{recurso}/{id}/     # Eliminar
```

### Autenticación JWT

```bash
# Login
POST /api/auth/login/
{ "username": "admin", "password": "Admin2024!" }

# Usar token en headers
Authorization: Bearer <access_token>

# Renovar token
POST /api/auth/refresh/
{ "refresh": "<refresh_token>" }
```

### Endpoints Principales

| Módulo | Endpoint |
|--------|---------|
| Proyectos | `/api/projects/projects/` |
| Bitácoras | `/api/logs/daily-logs/` |
| Equipos | `/api/equipment/equipment/` |
| Materiales | `/api/warehouse/materials/` |
| Empleados | `/api/personnel/employees/` |
| Nómina | `/api/payroll/periods/` |
| Facturas | `/api/accounting/invoices/` |
| Gastos | `/api/accounting/expenses/` |
| Clientes | `/api/admin/clients/` |
| Contratos | `/api/admin/contracts/` |
| Dashboard | `/api/dashboard/` |

## Tipos de Proyecto Soportados

- Construcción de Vías
- Movimiento de Tierras
- Infraestructura
- Edificación Residencial
- Edificación Comercial
- Proyecto Mixto

## Roles de Usuario

| Rol | Descripción |
|-----|------------|
| `admin` | Acceso total |
| `gerente` | Gerencia |
| `director_obra` | Director de Obra |
| `residente` | Residente de Obra |
| `almacenista` | Control de almacén |
| `contador` | Contabilidad |
| `rrhh` | Recursos Humanos |
| `operador` | Operador de equipo |
| `conductor` | Conductor |
| `visor` | Solo lectura |

## Estructura del Proyecto

```
Construction-managment/
├── backend/
│   ├── config/          # Configuración Django
│   ├── users/           # Usuarios y autenticación
│   ├── projects/        # Proyectos
│   ├── logs/            # Bitácoras diarias
│   ├── equipment/       # Equipos y maquinaria
│   ├── warehouse/       # Almacén de materiales
│   ├── personnel/       # Personal/RRHH
│   ├── payroll/         # Nómina
│   ├── accounting/      # Contabilidad
│   ├── administration/  # Clientes y contratos
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/         # Cliente HTTP
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas por módulo
│   │   ├── store/       # Estado global (Zustand)
│   │   └── types/       # TypeScript types
│   └── package.json
└── docker-compose.yml
```
