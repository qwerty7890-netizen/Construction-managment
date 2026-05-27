# ConstruGestión — Blueprint Completo

> Generado por The Architect · 2026-05-27
> Estado actual: Backend en Railway · Frontend en Cloudflare Pages · Login funcional

---

## Sección 1 — Visión del Proyecto

**Nombre:** ConstruGestión — Sistema de Gestión de Constructora

**Descripción:** Plataforma web integral para empresas constructoras colombianas. Centraliza la gestión de proyectos, bitácoras de obra, equipos, personal, nómina, inventario de materiales, contabilidad y administración de contratos.

**Usuarios objetivo:**
- Administrador del sistema
- Gerente de proyecto
- Director de obra
- Residente de obra
- Almacenista
- Contador
- RRHH
- Operador / Conductor
- Visor (solo lectura)

**Métricas de éxito:**
- Login funcional con roles y permisos ✅
- CRUD completo para los 9 módulos
- Dashboard con métricas en tiempo real
- Bitácoras diarias por proyecto
- Nómina calculada automáticamente (prestaciones sociales colombianas)
- Contabilidad con plan de cuentas

**Estado actual:**
- Backend desplegado: `https://construction-managment-production.up.railway.app`
- Frontend desplegado: `https://construction-managment.pages.dev`
- Superusuario: `admin / Admin2024!`
- Login funcionando ✅

---

## Sección 2 — Tech Stack

| Capa | Tecnología | Versión | Razón |
|------|-----------|---------|-------|
| **Backend framework** | Django | 5.2 | Maduro, ORM potente, admin gratis |
| **API** | Django REST Framework | 3.17 | Estándar para APIs Django |
| **Auth** | djangorestframework-simplejwt | 5.5 | JWT con refresh automático |
| **CORS** | django-cors-headers | 4.9 | Permite requests desde Cloudflare Pages |
| **Filtros** | django-filter | 25.2 | Filtrado declarativo en ViewSets |
| **Docs API** | drf-spectacular | 0.29 | OpenAPI 3 + Swagger UI en `/api/docs/` |
| **Archivos estáticos** | whitenoise | 6.9 | Sirve estáticos sin Nginx en producción |
| **Config env** | python-decouple | 3.8 | Variables de entorno tipadas |
| **DB URL** | dj-database-url | 2.3 | Parsea DATABASE_URL de Railway |
| **Imágenes** | Pillow | 11.2 | Upload de fotos de empleados y equipos |
| **Servidor** | gunicorn | 23.0 | WSGI production-grade |
| **Base de datos** | PostgreSQL | 17 | Relacional, Railway managed |
| **Frontend framework** | React | 19.2 | UI reactiva con hooks modernos |
| **Lenguaje frontend** | TypeScript | 6.0 | Tipos estrictos, menos bugs |
| **Build tool** | Vite | 8.0 | HMR rápido, build optimizado |
| **Routing** | React Router DOM | 7.15 | SPA routing con loaders |
| **Data fetching** | TanStack React Query | 5.100 | Cache, invalidación, loading states |
| **HTTP client** | Axios | 1.16 | Interceptors para JWT automático |
| **Estado global** | Zustand | 5.0 | Auth store mínimo y limpio |
| **Formularios** | React Hook Form | 7.75 | Performance, sin re-renders |
| **Validación** | Zod | 4.4 | Schemas tipados compartibles |
| **Estilos** | Tailwind CSS | 4.3 | Utility-first, dark mode fácil |
| **Iconos** | Lucide React | 1.14 | SVG consistentes, tree-shakeable |
| **Charts** | Recharts | 3.8 | Composable, React-native |
| **Fechas** | date-fns | 4.1 | Ligero, funcional |
| **Backend hosting** | Railway | — | PostgreSQL + deploys desde GitHub |
| **Frontend hosting** | Cloudflare Pages | — | CDN global, gratis, SPA-ready |
| **CI/CD** | GitHub → Railway/Cloudflare | — | Push → deploy automático |

---

## Sección 3 — Estructura de Directorios

```
Construction-managment/
├── backend/                        # Django project (Root Directory en Railway)
│   ├── config/
│   │   ├── settings.py             # Config principal (env vars con decouple)
│   │   ├── urls.py                 # URL routing raíz
│   │   ├── wsgi.py                 # WSGI entry point
│   │   ├── asgi.py                 # ASGI (futuro WebSockets)
│   │   └── dashboard_urls.py       # URLs del dashboard
│   ├── users/                      # Módulo: usuarios y auth
│   │   ├── models.py               # User (AbstractUser + role + avatar)
│   │   ├── serializers.py
│   │   ├── views.py                # UserViewSet
│   │   └── urls.py
│   ├── projects/                   # Módulo: proyectos
│   │   ├── models.py               # Project, ProjectPhase, ProjectDocument
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── logs/                       # Módulo: bitácoras diarias
│   │   ├── models.py               # DailyLog, LogActivity, LogPersonnel,
│   │   │                           # LogEquipment, LogMaterial, LogIncident
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── equipment/                  # Módulo: equipos
│   │   ├── models.py               # Equipment, EquipmentAssignment,
│   │   │                           # EquipmentMaintenance, FuelLog
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── warehouse/                  # Módulo: almacén / inventario
│   │   ├── models.py               # Material, MaterialCategory, Supplier,
│   │   │                           # PurchaseOrder, MaterialEntry, MaterialExit
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── personnel/                  # Módulo: personal / RRHH
│   │   ├── models.py               # Employee, Department, Position,
│   │   │                           # EmployeeDocument
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── payroll/                    # Módulo: nómina
│   │   ├── models.py               # PayrollPeriod, PayrollEntry, SalaryAdvance
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── accounting/                 # Módulo: contabilidad
│   │   ├── models.py               # Account, Journal, JournalEntry,
│   │   │                           # Invoice, InvoiceItem, Expense, Budget
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── administration/             # Módulo: administración
│   │   ├── models.py               # Client, Contractor, Contract, ContractAddendum
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── fixtures/                   # Datos de prueba (JSON)
│   ├── manage.py
│   ├── create_superuser.py         # Script idempotente para admin inicial
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── railway.json                # Deploy config (startCommand, builder)
│   └── .env                       # Local only (nunca en git)
│
├── frontend/                       # React + Vite (Root Directory en Cloudflare)
│   ├── public/
│   │   └── _redirects              # "/* /index.html 200" para SPA routing
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts           # Axios instance + JWT interceptors
│   │   │   └── *.ts                # Un archivo por módulo (projects.ts, etc.)
│   │   ├── components/
│   │   │   ├── Layout.tsx          # Shell con Sidebar
│   │   │   ├── Sidebar.tsx         # Navegación lateral
│   │   │   ├── Badge.tsx           # Badges de estado
│   │   │   ├── Card.tsx            # Container
│   │   │   ├── ConfirmDialog.tsx   # Modales de confirmación
│   │   │   ├── FormField.tsx       # Wrapper de campos
│   │   │   ├── Modal.tsx           # Modal genérico
│   │   │   ├── Pagination.tsx      # Controles de paginación
│   │   │   └── StatCard.tsx        # Cards de métricas
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── projects/
│   │   │   ├── logs/
│   │   │   ├── equipment/
│   │   │   ├── warehouse/
│   │   │   ├── personnel/
│   │   │   ├── payroll/
│   │   │   ├── accounting/
│   │   │   ├── administration/
│   │   │   └── profile/
│   │   ├── store/
│   │   │   └── authStore.ts        # Zustand: user, isAuthenticated
│   │   ├── types/
│   │   │   └── index.ts            # Interfaces TypeScript de todos los modelos
│   │   ├── utils/                  # Helpers (fechas, formateo, etc.)
│   │   ├── App.tsx                 # Router + PrivateRoute
│   │   └── main.tsx                # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js          # (implícito en Tailwind v4)
│   └── .gitignore
│
├── output/
│   └── construgestion-blueprint.md # Este archivo
├── docker-compose.yml              # Desarrollo local (backend + postgres + frontend)
├── .gitignore
└── README.md
```

---

## Sección 4 — Modelo de Datos

### Diagrama de relaciones

```
User (users_user)
  └── role: admin | gerente | director_obra | residente |
           almacenista | contador | rrhh | operador | conductor | visor

Project (projects_project)
  ├── director → User
  ├── resident → User
  ├── ProjectPhase[]
  └── ProjectDocument[]

DailyLog (logs_dailylog)
  ├── project → Project
  ├── created_by → User
  ├── LogActivity[]
  ├── LogPersonnel[] → Employee
  ├── LogEquipment[] → Equipment + Employee
  ├── LogMaterial[] → Material
  └── LogIncident[]

Equipment (equipment_equipment)
  ├── EquipmentAssignment[] → Project + Employee
  ├── EquipmentMaintenance[]
  └── FuelLog[] → Project + User

Employee (personnel_employee)
  ├── department → Department
  ├── position → Position → Department
  └── EmployeeDocument[]

PayrollPeriod (payroll_payrollperiod)
  ├── created_by → User
  ├── PayrollEntry[] → Employee
  └── SalaryAdvance[] → Employee + User

Invoice (accounting_invoice)
  ├── project → Project
  ├── client → Client
  └── InvoiceItem[]

Journal (accounting_journal)
  ├── project → Project
  ├── created_by → User
  └── JournalEntry[] → Account

Expense (accounting_expense)
  ├── project → Project
  ├── supplier → Supplier
  └── requested_by / approved_by → User

Contract (administration_contract)
  ├── project → Project
  ├── client → Client
  ├── contractor → Contractor
  └── ContractAddendum[]

PurchaseOrder (warehouse_purchaseorder)
  ├── supplier → Supplier
  ├── project → Project
  ├── created_by → User
  └── PurchaseOrderItem[] → Material

MaterialEntry / MaterialExit (warehouse)
  ├── material → Material
  └── project → Project
```

### Campos críticos por modelo

| Modelo | Campos clave |
|--------|-------------|
| User | username, email, role, avatar |
| Project | code, name, status, contract_value, director, resident |
| DailyLog | project, date, weather_morning/afternoon, temperature_min/max |
| Equipment | code, equipment_type, status, ownership, current_hourmeter |
| Employee | employee_code, id_number, department, position, base_salary, status |
| PayrollEntry | days_worked, regular_hours, extra_hours_*, total_devengado, net_pay |
| Invoice | invoice_number, invoice_type, project, client, status, total, paid_amount |
| Contract | contract_number, contract_type, project, value, status |
| Material | code, name, unit, current_stock, minimum_stock, unit_price |

---

## Sección 5 — Diseño de API

### Convenciones
- Base URL: `https://construction-managment-production.up.railway.app`
- Todas las rutas bajo `/api/`
- Auth: `Authorization: Bearer <access_token>`
- Paginación: `?page=1&page_size=20`
- Filtros: `?status=activo&project=1`
- Formato: JSON

### Endpoints por módulo

#### Auth
```
POST   /api/auth/login/          { username, password } → { access, refresh }
POST   /api/auth/refresh/        { refresh } → { access }
GET    /api/health/              → { status: "ok" }
```

#### Users
```
GET    /api/users/               Lista de usuarios (admin only)
POST   /api/users/               Crear usuario
GET    /api/users/{id}/          Detalle
PUT    /api/users/{id}/          Actualizar
PATCH  /api/users/{id}/          Actualizar parcial
DELETE /api/users/{id}/          Eliminar
GET    /api/users/me/            Usuario actual
```

#### Projects
```
GET    /api/projects/                              Lista + filtros
POST   /api/projects/                              Crear
GET    /api/projects/{id}/                         Detalle
PUT    /api/projects/{id}/                         Actualizar
GET    /api/projects/{id}/phases/                  Fases del proyecto
POST   /api/projects/{id}/phases/                  Crear fase
GET    /api/projects/{id}/documents/               Documentos
POST   /api/projects/{id}/documents/               Subir documento
```

#### Logs (Bitácoras)
```
GET    /api/logs/                                  Lista de bitácoras
POST   /api/logs/                                  Crear bitácora
GET    /api/logs/{id}/                             Detalle
GET    /api/logs/{id}/activities/                  Actividades del día
POST   /api/logs/{id}/activities/                  Agregar actividad
GET    /api/logs/{id}/personnel/                   Personal del día
POST   /api/logs/{id}/personnel/                   Registrar asistencia
GET    /api/logs/{id}/equipment/                   Equipos del día
POST   /api/logs/{id}/equipment/                   Registrar equipo
GET    /api/logs/{id}/materials/                   Materiales usados
POST   /api/logs/{id}/materials/                   Registrar material
GET    /api/logs/{id}/incidents/                   Incidentes
POST   /api/logs/{id}/incidents/                   Reportar incidente
```

#### Equipment
```
GET    /api/equipment/                             Lista equipos
POST   /api/equipment/                             Registrar equipo
GET    /api/equipment/{id}/                        Detalle
GET    /api/equipment/{id}/assignments/            Asignaciones
POST   /api/equipment/{id}/assignments/            Asignar a proyecto
GET    /api/equipment/{id}/maintenance/            Historial mantenimiento
POST   /api/equipment/{id}/maintenance/            Programar mantenimiento
GET    /api/equipment/{id}/fuel/                   Historial combustible
POST   /api/equipment/{id}/fuel/                   Registrar recarga
```

#### Warehouse
```
GET    /api/warehouse/materials/                   Inventario
POST   /api/warehouse/materials/                   Nuevo material
GET    /api/warehouse/materials/{id}/              Detalle + stock actual
GET    /api/warehouse/categories/                  Categorías
GET    /api/warehouse/suppliers/                   Proveedores
POST   /api/warehouse/suppliers/                   Registrar proveedor
GET    /api/warehouse/purchase-orders/             Órdenes de compra
POST   /api/warehouse/purchase-orders/             Crear orden
GET    /api/warehouse/entries/                     Entradas de material
POST   /api/warehouse/entries/                     Registrar entrada
GET    /api/warehouse/exits/                       Salidas de material
POST   /api/warehouse/exits/                       Registrar salida
```

#### Personnel
```
GET    /api/personnel/employees/                   Lista empleados
POST   /api/personnel/employees/                   Contratar empleado
GET    /api/personnel/employees/{id}/              Hoja de vida
GET    /api/personnel/departments/                 Departamentos
GET    /api/personnel/positions/                   Cargos
```

#### Payroll
```
GET    /api/payroll/periods/                       Períodos de nómina
POST   /api/payroll/periods/                       Crear período
GET    /api/payroll/periods/{id}/                  Detalle período
GET    /api/payroll/periods/{id}/entries/          Liquidaciones del período
POST   /api/payroll/periods/{id}/entries/          Agregar empleado al período
GET    /api/payroll/advances/                      Anticipos de salario
POST   /api/payroll/advances/                      Solicitar anticipo
```

#### Accounting
```
GET    /api/accounting/accounts/                   Plan de cuentas
POST   /api/accounting/accounts/                   Nueva cuenta
GET    /api/accounting/journals/                   Comprobantes
POST   /api/accounting/journals/                   Nuevo comprobante
GET    /api/accounting/invoices/                   Facturas
POST   /api/accounting/invoices/                   Nueva factura
GET    /api/accounting/expenses/                   Gastos
POST   /api/accounting/expenses/                   Registrar gasto
GET    /api/accounting/budgets/                    Presupuestos por categoría
```

#### Administration
```
GET    /api/admin/clients/                         Clientes
POST   /api/admin/clients/                         Nuevo cliente
GET    /api/admin/contractors/                     Contratistas
POST   /api/admin/contractors/                     Nuevo contratista
GET    /api/admin/contracts/                       Contratos
POST   /api/admin/contracts/                       Nuevo contrato
GET    /api/admin/contracts/{id}/addenda/          Adendas del contrato
POST   /api/admin/contracts/{id}/addenda/          Nueva adenda
```

#### Dashboard
```
GET    /api/dashboard/                             KPIs globales
  Respuesta:
  {
    "active_projects": int,
    "total_employees": int,
    "equipment_available": int,
    "low_stock_materials": int,
    "pending_invoices": decimal,
    "monthly_expenses": decimal,
    ...
  }
```

---

## Sección 6 — Arquitectura Frontend

### Estructura de páginas

```
/ (Dashboard)
  ├── KPI cards (proyectos activos, empleados, equipos)
  ├── Gráfico de gastos por mes (Recharts)
  ├── Lista de proyectos recientes
  └── Incidentes recientes

/projects
  ├── ProjectListPage — tabla con filtros
  ├── ProjectNewPage — formulario creación
  ├── ProjectDetailPage — detalle con tabs (info, fases, documentos)
  └── ProjectEditPage — formulario edición

/logs
  ├── LogListPage — lista de bitácoras con filtro por proyecto/fecha
  └── LogNewPage — formulario multi-step (clima → actividades → personal → equipos → materiales → incidentes)

/equipment
  ├── EquipmentListPage — grid/tabla con estado
  ├── EquipmentNewPage — registro de equipo
  ├── EquipmentDetailPage — tabs (info, asignaciones, mantenimiento, combustible)
  └── EquipmentEditPage

/warehouse
  └── WarehousePage — tabs:
        ├── Tab: Materiales (inventario, alertas de stock mínimo)
        ├── Tab: Entradas
        └── Tab: Salidas

/personnel
  ├── PersonnelListPage — tabla empleados
  ├── PersonnelNewPage — formulario completo (datos personales, contrato, EPS, ARL)
  ├── PersonnelDetailPage — hoja de vida con documentos
  └── PersonnelEditPage

/payroll
  ├── PayrollListPage — períodos de nómina
  ├── PayrollNewPage — crear período y seleccionar empleados
  └── PayrollPeriodPage — detalle período con liquidaciones individuales

/accounting
  └── AccountingPage — tabs:
        ├── Tab: Facturas
        ├── Tab: Gastos
        └── Tab: Presupuesto vs Real

/administration
  └── AdministrationPage — tabs:
        ├── Tab: Clientes
        ├── Tab: Contratistas
        └── Tab: Contratos

/profile
  └── ProfilePage — datos del usuario, cambio de contraseña, avatar
```

### Flujo de autenticación

```
1. Usuario entra a cualquier ruta
2. PrivateRoute verifica authStore.isAuthenticated
3. Si no → redirect a /login
4. Login → POST /api/auth/login/ → guarda tokens en localStorage
5. Axios interceptor añade Bearer token a cada request
6. Si 401 → intenta refresh → si falla → logout + redirect /login
```

### Gestión de estado

| Estado | Herramienta | Ubicación |
|--------|-------------|-----------|
| Auth (user, tokens) | Zustand + localStorage | authStore.ts |
| Datos del servidor | React Query | hooks por módulo |
| Formularios | React Hook Form + Zod | en cada página |
| UI local (modals, tabs) | useState | componente local |

---

## Sección 7 — Sistema de Diseño

### Paleta de colores

| Token | Color | Uso |
|-------|-------|-----|
| Primary | `#F59E0B` (amber-400) | CTA, logo, botones principales |
| Primary dark | `#D97706` (amber-600) | Hover estado |
| Background | `#0F172A` (slate-900) | Fondo principal |
| Surface | `#1E293B` (slate-800) | Cards, sidebar |
| Surface light | `#334155` (slate-700) | Inputs, borders |
| Text primary | `#F8FAFC` (slate-50) | Texto principal |
| Text secondary | `#94A3B8` (slate-400) | Labels, subtítulos |
| Success | `#10B981` (emerald-500) | Estado activo, stock OK |
| Warning | `#F59E0B` (amber-500) | Alertas, stock bajo |
| Danger | `#EF4444` (red-500) | Errores, incidentes |
| Info | `#3B82F6` (blue-500) | Info, links |

### Tipografía
- Font: Sistema (system-ui, -apple-system) — sin Google Fonts para privacidad
- Scale: Tailwind defaults (text-sm, text-base, text-lg, text-xl, text-2xl)

### Componentes base

| Componente | Estado actual | Notas |
|-----------|--------------|-------|
| Badge | ✅ Implementado | Variantes por status |
| Card | ✅ Implementado | Container estándar |
| StatCard | ✅ Implementado | Para dashboard KPIs |
| Modal | ✅ Implementado | Portal + backdrop |
| ConfirmDialog | ✅ Implementado | Para deletes |
| FormField | ✅ Implementado | Label + input + error |
| Pagination | ✅ Implementado | Conectado a React Query |
| Sidebar | ✅ Implementado | Con íconos Lucide |
| Layout | ✅ Implementado | Shell completo |
| DataTable | ⚠️ Por completar | Tabla genérica reutilizable |
| DatePicker | ⚠️ Por completar | Para formularios de fechas |

---

## Sección 8 — Auth y Autorización

### Flujo JWT

```
Login: POST /api/auth/login/ { username, password }
  → { access: "...", refresh: "..." }
  → Guarda en localStorage
  → authStore.setUser(user)

Cada request:
  → Header: Authorization: Bearer <access>

Token expirado (401):
  → POST /api/auth/refresh/ { refresh: "..." }
  → Si OK: nuevo access, reintentar request
  → Si falla: logout(), redirect /login

Access token: 8 horas
Refresh token: 7 días (rotación habilitada)
```

### Roles y acceso

| Rol | Proyectos | Bitácoras | Equipos | Almacén | Personal | Nómina | Contabilidad | Admin |
|-----|-----------|-----------|---------|---------|----------|--------|--------------|-------|
| admin | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| gerente | CRUD | Read | Read | Read | Read | Read | CRUD | CRUD |
| director_obra | CRUD | CRUD | Read | Read | Read | — | — | Read |
| residente | Read | CRUD | Read | CRUD | — | — | — | — |
| almacenista | — | Read | — | CRUD | — | — | — | — |
| contador | — | — | — | Read | Read | Read | CRUD | Read |
| rrhh | — | — | — | — | CRUD | CRUD | — | — |
| operador/conductor | — | Read | — | — | — | — | — | — |
| visor | Read | Read | Read | Read | Read | — | — | Read |

> **IMPORTANTE:** Los permisos a nivel de ViewSet están por implementar. Actualmente todos los usuarios autenticados tienen acceso completo. Se deben agregar `permission_classes` por rol usando `request.user.role`.

---

## Sección 9 — Orden de Construcción

> Esta sección define exactamente qué construir y en qué orden.

### Estado actual (lo que ya existe ✅)

- [x] Django project con 9 apps registradas
- [x] Todos los modelos (users, projects, logs, equipment, warehouse, personnel, payroll, accounting, administration)
- [x] Migraciones aplicadas en Railway PostgreSQL
- [x] JWT auth funcional
- [x] CORS configurado
- [x] Superusuario `admin / Admin2024!` creado
- [x] Backend desplegado en Railway
- [x] Frontend React + Vite + TypeScript + Tailwind
- [x] React Router con rutas protegidas
- [x] Zustand authStore
- [x] Axios client con interceptors JWT
- [x] TypeScript interfaces para todos los modelos
- [x] Login page funcional
- [x] Layout con Sidebar
- [x] Componentes base (Badge, Card, Modal, FormField, Pagination, StatCard)
- [x] Frontend desplegado en Cloudflare Pages

### Paso 1 — Completar serializers y ViewSets del backend

Para cada app que lo necesite:

**1.1 users/serializers.py**
```python
class UserSerializer(ModelSerializer):
    # Incluir: id, username, email, first_name, last_name, role, avatar, phone
    # Excluir: password del response

class UserCreateSerializer(ModelSerializer):
    # Con campo password (write_only)
```

**1.2 users/views.py**
```python
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']

    @action(detail=False, methods=['get'])
    def me(self, request):
        return Response(UserSerializer(request.user).data)
```

Repetir para todos los módulos: projects, logs, equipment, warehouse, personnel, payroll, accounting, administration.

### Paso 2 — Dashboard endpoint

**config/dashboard_urls.py** + vista:
```python
def dashboard_data(request):
    return Response({
        'active_projects': Project.objects.filter(status='en_ejecucion').count(),
        'total_employees': Employee.objects.filter(status='activo').count(),
        'equipment_available': Equipment.objects.filter(status='disponible').count(),
        'low_stock_materials': Material.objects.filter(
            current_stock__lte=F('minimum_stock')
        ).count(),
        'recent_incidents': LogIncident.objects.order_by('-id')[:5].values(),
        'recent_projects': Project.objects.order_by('-created_at')[:5].values(),
    })
```

### Paso 3 — API functions en frontend

Para cada módulo, crear `src/api/<module>.ts`:

```typescript
// src/api/projects.ts
export const projectsApi = {
  list: (params?) => client.get('/projects/', { params }),
  create: (data) => client.post('/projects/', data),
  get: (id) => client.get(`/projects/${id}/`),
  update: (id, data) => client.put(`/projects/${id}/`, data),
  delete: (id) => client.delete(`/projects/${id}/`),
  phases: (id) => client.get(`/projects/${id}/phases/`),
}
```

### Paso 4 — Páginas por módulo

Orden de implementación recomendado:

1. **Dashboard** — necesita endpoint backend del Paso 2
2. **Projects** — list + detail + CRUD
3. **Personnel** — list + detail (base para logs y nómina)
4. **Equipment** — list + detail + asignaciones
5. **Warehouse** — inventario + entradas + salidas
6. **Logs** — bitácora diaria (usa projects + personnel + equipment + warehouse)
7. **Payroll** — períodos + liquidación automática
8. **Accounting** — facturas + gastos + presupuesto
9. **Administration** — clientes + contratistas + contratos
10. **Profile** — cambio de contraseña + avatar

### Paso 5 — Permisos por rol

Agregar en cada ViewSet:
```python
from rest_framework.permissions import IsAuthenticated

class ProjectViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, ProjectPermission]

class ProjectPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.role in ['admin', 'gerente', 'director_obra', 'residente', 'visor']
        return request.user.role in ['admin', 'gerente', 'director_obra']
```

### Paso 6 — Features adicionales

- [ ] Exportar bitácoras a PDF
- [ ] Reportes de nómina en Excel
- [ ] Notificaciones de mantenimiento próximo
- [ ] Dashboard por proyecto
- [ ] Cambio de contraseña desde perfil
- [ ] Upload de foto de perfil
- [ ] Dominio personalizado `kitvox.com` en Cloudflare Pages
- [ ] Dominio `api.kitvox.com` en Railway

---

## Sección 10 — Setup del Entorno

### Variables de entorno — Backend (Railway)

| Variable | Valor | Notas |
|----------|-------|-------|
| `SECRET_KEY` | `django-insecure-...` | Generar con `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DEBUG` | `False` | Siempre False en producción |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1,construction-managment-production.up.railway.app` | Agregar dominio propio cuando esté listo |
| `CORS_ALLOWED_ORIGINS` | `https://construction-managment.pages.dev,http://localhost:5173,http://localhost:3000` | Agregar `https://kitvox.com` cuando esté listo |
| `DATABASE_URL` | `postgresql://...` | Railway lo provee automáticamente |

### Variables de entorno — Frontend (Cloudflare Pages)

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://construction-managment-production.up.railway.app` |

### Desarrollo local

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configurar DATABASE_URL local
python manage.py migrate
python create_superuser.py
python manage.py runserver

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Con Docker Compose (recomendado para local)
```bash
docker-compose up --build
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
# PgAdmin: http://localhost:5050
```

---

## Sección 11 — Dependencias

### Backend (requirements.txt)

```
django==5.2.14                    # Framework principal
djangorestframework==3.17.1       # API REST
djangorestframework-simplejwt==5.5.1  # JWT auth
django-cors-headers==4.9.0        # CORS para frontend separado
django-filter==25.2               # Filtros en ViewSets
drf-spectacular==0.29.0           # OpenAPI 3 + Swagger
Pillow==11.2.1                    # Uploads de imágenes
psycopg2-binary==2.9.12           # Driver PostgreSQL
python-decouple==3.8              # Variables de entorno tipadas
gunicorn==23.0.0                  # Servidor WSGI producción
dj-database-url==2.3.0            # Parsear DATABASE_URL de Railway
whitenoise==6.9.0                 # Estáticos sin Nginx
```

### Frontend (package.json)

```json
"dependencies": {
  "react": "19.2.5",
  "react-dom": "19.2.5",
  "react-router-dom": "7.15.0",
  "@tanstack/react-query": "5.100.9",
  "axios": "1.16.0",
  "zustand": "5.0.13",
  "react-hook-form": "7.75.0",
  "zod": "4.4.3",
  "recharts": "3.8.1",
  "date-fns": "4.1.0",
  "lucide-react": "1.14.0"
},
"devDependencies": {
  "vite": "8.0.10",
  "typescript": "6.0.2",
  "tailwindcss": "4.3.0",
  "@tailwindcss/vite": "4.3.0",
  "@types/react": "19.x",
  "@types/react-dom": "19.x",
  "eslint": "10.2.1"
}
```

---

## Sección 12 — Despliegue

### Arquitectura de producción

```
GitHub (rama: claude/construction-management-app-N9uSP)
    │
    ├── Push a /backend → Railway detecta railway.json
    │       │
    │       ▼
    │   Railway (Nixpacks build)
    │       startCommand: sh -c '
    │         python manage.py collectstatic --noinput &&
    │         python create_superuser.py &&
    │         gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120
    │       '
    │       └── PostgreSQL (Railway managed, puerto privado)
    │
    └── Push a /frontend → Cloudflare Pages detecta cambios
            │
            ▼
        Cloudflare Pages (build)
            Build command: npm run build
            Output dir: dist
            Root dir: frontend
            Env: VITE_API_URL=https://construction-managment-production.up.railway.app
            └── _redirects: /* /index.html 200
```

### Configuraciones críticas

**railway.json** (backend/railway.json):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "sh -c 'python manage.py collectstatic --noinput && python create_superuser.py && gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120'",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

**Cloudflare Pages Settings:**
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `frontend`
- Node version: 18+

### Dominio personalizado (pendiente)

1. Cloudflare Pages → Custom domains → Agregar `kitvox.com`
2. Railway → Settings → Domains → Agregar `api.kitvox.com`
3. Actualizar en Railway: `ALLOWED_HOSTS` + `CORS_ALLOWED_ORIGINS`
4. Actualizar en Cloudflare: `VITE_API_URL=https://api.kitvox.com` → rebuild

### Healthcheck (desactivado temporalmente)

Para reactivar cuando el deploy sea estable, agregar a railway.json:
```json
"healthcheckPath": "/api/health/",
"healthcheckTimeout": 300
```

---

## Sección 13 — Testing

### Backend

```bash
# Ejecutar tests
cd backend
python manage.py test

# Tests por módulo
python manage.py test projects
python manage.py test payroll

# Con coverage
pip install coverage
coverage run manage.py test
coverage report
```

**Tests prioritarios a escribir:**
1. `test_login` — POST /api/auth/login/ con credenciales válidas/inválidas
2. `test_payroll_calculation` — verificar que calculate() aplica prestaciones correctas
3. `test_stock_movement` — entrada + salida de material actualiza current_stock
4. `test_project_permissions` — visor no puede hacer POST
5. `test_daily_log_unique` — no se puede crear dos bitácoras para mismo proyecto/fecha

### Frontend

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Preview del build
npm run build && npm run preview
```

**Tests manuales del golden path:**
1. Login → Dashboard carga con datos
2. Crear proyecto → aparece en lista
3. Crear bitácora → registrar actividades del día
4. Registrar entrada de material → stock se actualiza
5. Crear período de nómina → calcular → verificar neto

---

## Sección 14 — Skills de Claude Code a Usar

Durante la construcción de features pendientes:

| Skill | Cuándo usarlo |
|-------|--------------|
| `/run` | Verificar que la app corre tras cada cambio |
| `/verify` | Confirmar que un fix funciona en el browser |
| `/code-review` | Revisar serializers o ViewSets complejos |
| `/security-review` | Antes de agregar permisos por rol |

---

## Sección 15 — CLAUDE.md

```markdown
# ConstruGestión — Instrucciones para Claude Code

## El proyecto
Sistema de gestión para constructoras. Django backend en Railway + React frontend en Cloudflare Pages.

## Rama de trabajo
`claude/construction-management-app-N9uSP`

## Cómo correr en local
cd backend && python manage.py runserver
cd frontend && npm run dev

## Backend
- Django 5.2 + DRF + SimpleJWT
- PostgreSQL via DATABASE_URL
- 9 apps: users, projects, logs, equipment, warehouse, personnel, payroll, accounting, administration
- API docs: http://localhost:8000/api/docs/

## Frontend
- React 19 + TypeScript + Vite + Tailwind CSS 4
- API client en src/api/client.ts (Axios + JWT interceptors)
- Estado auth en src/store/authStore.ts (Zustand)
- Todos los tipos en src/types/index.ts

## Deployado en producción
- Backend: https://construction-managment-production.up.railway.app
- Frontend: https://construction-managment.pages.dev
- Admin: admin / Admin2024!

## Convenciones
- Español para variables de dominio (status: 'activo', role: 'gerente')
- Inglés para código Python/TypeScript
- Sin comentarios obvios — nombres descriptivos
- No agregar features no solicitadas

## Lo que NO está completo
- Permisos por rol en ViewSets (actualmente IsAuthenticated global)
- Algunas páginas del frontend tienen UI básica pendiente de completar
- No hay tests unitarios aún
- No hay dominio personalizado kitvox.com aún
```

---

## Sección 16 — Reglas No Negociables

1. **Nunca hardcodear credenciales** — siempre desde variables de entorno
2. **Nunca push a main** — solo a `claude/construction-management-app-N9uSP`
3. **El backend siempre en `/backend/`** — Railway apunta a ese directorio como root
4. **El frontend siempre en `/frontend/`** — Cloudflare Pages apunta a ese directorio
5. **`_redirects` siempre `/* /index.html 200`** — sin el `!` de Netlify
6. **`railway.json` siempre con `sh -c '...'`** — Railway exec mode no expande `$PORT`
7. **`collectstatic` siempre antes de gunicorn** — WhiteNoise necesita staticfiles.json
8. **`CORS_ALLOWED_ORIGINS` debe incluir el dominio del frontend** — si no, login no funciona
9. **Puerto 8000 hardcodeado en Railway** — el usuario configuró el dominio con ese puerto
10. **`create_superuser.py` es idempotente** — verifica si existe antes de crear
11. **Cálculo de nómina colombiana** — incluir salud (4%), pensión (4%), parafiscales empleador
12. **Fechas y monedas en español colombiano** — timezone `America/Bogota`, COP

---

*Blueprint generado el 2026-05-27 · ConstruGestión v1.0*
*Backend ✅ Online · Frontend ✅ Online · Login ✅ Funcional*
