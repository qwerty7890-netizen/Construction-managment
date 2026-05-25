# BLUEPRINT — ConstruGestión
## Sistema Empresarial de Gestión de Constructora

**Versión:** 1.0.0  
**Fecha:** Mayo 2026  
**Marco:** PMI/PMBOK 7ª Edición  
**Organización:** Voxel Tek  

---

## TABLA DE CONTENIDOS

1. [Visión del Producto](#1-visión-del-producto)
2. [Dominios de Desempeño — PMBOK 7](#2-dominios-de-desempeño--pmbok-7)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Módulos del Sistema](#4-módulos-del-sistema)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Arquitectura de API](#6-arquitectura-de-api)
7. [Arquitectura Frontend](#7-arquitectura-frontend)
8. [Seguridad y Roles](#8-seguridad-y-roles)
9. [Infraestructura y Despliegue](#9-infraestructura-y-despliegue)
10. [Roadmap de Desarrollo](#10-roadmap-de-desarrollo)
11. [Riesgos del Proyecto](#11-riesgos-del-proyecto)
12. [Métricas de Éxito](#12-métricas-de-éxito)

---

## 1. VISIÓN DEL PRODUCTO

### 1.1 Declaración de Visión

> **ConstruGestión** es el sistema nervioso central de una empresa constructora moderna.  
> Digitaliza, integra y da visibilidad en tiempo real a todos los procesos del negocio:  
> desde la bitácora de campo hasta la contabilidad, desde la llave de la excavadora  
> hasta la firma del contrato.

### 1.2 Problema que Resuelve

| Problema Actual | Solución ConstruGestión |
|-----------------|-------------------------|
| Bitácoras en papel, perdibles y sin trazabilidad | Bitácoras digitales con historial, firma y alertas |
| Inventario de materiales descontrolado | Almacén con kardex automático y alertas de stock mínimo |
| Horas de maquinaria registradas en Excel | Control de horómetro, combustible y mantenimientos por equipo |
| Nómina calculada manualmente | Liquidación automática con modelo colombiano (EPS, ARL, pensión) |
| Sin visibilidad financiera en tiempo real | Dashboard con KPIs financieros, presupuesto vs. ejecución |
| Contratos y actas en carpetas físicas | Gestión digital de contratos, otrosíes y actas de cobro |
| Sin control de incidentes de seguridad | Registro de incidentes por severidad con seguimiento |

### 1.3 Usuarios Objetivo

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIOS DEL SISTEMA                  │
├──────────────────┬──────────────────┬────────────────────┤
│   DIRECTIVOS     │   CAMPO          │   ADMINISTRATIVOS  │
├──────────────────┼──────────────────┼────────────────────┤
│ • Gerente        │ • Director Obra  │ • Contador         │
│ • Admin Sistema  │ • Residente Obra │ • RRHH             │
│                  │ • Inspector      │ • Almacenista      │
│                  │ • Operador Equip │                    │
│                  │ • Conductor      │                    │
└──────────────────┴──────────────────┴────────────────────┘
```

---

## 2. DOMINIOS DE DESEMPEÑO — PMBOK 7

Siguiendo el **PMBOK 7ª Edición**, el proyecto se alinea a los 8 dominios de desempeño:

### 2.1 Interesados (Stakeholders)

| Interesado | Interés | Influencia | Estrategia |
|-----------|---------|------------|------------|
| Gerencia General | ROI, visibilidad | Alta | Demos periódicas, dashboard ejecutivo |
| Directores de Obra | Facilitar trabajo diario | Alta | Capacitación, UX simple en campo |
| Contadores | Exactitud financiera | Media | Integración con módulos de costos |
| Personal de Campo | Facilidad de uso | Baja | App móvil-friendly, offline-first futuro |
| Clientes/Entidades | Reportes e informes | Media | Exportación PDF, informes automáticos |

### 2.2 Equipo (Team)

**Estructura recomendada para implementación:**

```
Product Owner (Gerencia)
    │
    ├── Tech Lead / Arquitecto (Voxel Tek)
    │       ├── Backend Developer (Django/Python)
    │       ├── Frontend Developer (React/TypeScript)
    │       └── DevOps Engineer
    │
    └── Functional Analyst
            ├── Especialista Construcción (SME)
            └── QA / Testing
```

### 2.3 Enfoque de Desarrollo (Development Approach)

**Metodología:** Híbrida — **Scrum + Kanban**

```
Sprint 0 (2 sem): Arquitectura base, setup, CI/CD
Sprint 1 (2 sem): Proyectos + Usuarios + Auth
Sprint 2 (2 sem): Bitácoras + Equipos
Sprint 3 (2 sem): Almacén + Personal
Sprint 4 (2 sem): Nómina + Contabilidad
Sprint 5 (2 sem): Administración + Dashboard
Sprint 6 (2 sem): Integración, pruebas, ajustes
Sprint 7 (2 sem): UAT, capacitación, go-live
```

**Ciclo de vida del producto:** Adaptativo (Agile)  
**Ciclo de vida de entregables:** Incremental

### 2.4 Planificación (Planning)

**Estimación por Puntos de Historia:**

| Módulo | Story Points | Prioridad | Sprint |
|--------|-------------|-----------|--------|
| Auth + Usuarios | 13 | Must | 1 |
| Proyectos | 21 | Must | 1 |
| Bitácoras | 34 | Must | 2 |
| Equipos y Maquinaria | 34 | Must | 2 |
| Almacén | 28 | Must | 3 |
| Personal | 21 | Must | 3 |
| Nómina | 34 | Must | 4 |
| Contabilidad | 40 | Must | 4 |
| Administración/Contratos | 21 | Should | 5 |
| Dashboard y KPIs | 21 | Must | 5 |
| Reportes PDF | 21 | Should | 6 |
| App Móvil (PWA) | 34 | Could | Fase 2 |
| **Total Fase 1** | **267** | | **16 semanas** |

### 2.5 Trabajo del Proyecto (Project Work)

**Entregables por fase:**

```
FASE 1 — MVP (16 semanas)
├── Backend API completa (9 módulos)
├── Frontend Web responsivo
├── Base de datos PostgreSQL con migraciones
├── Autenticación JWT con roles
├── Docker Compose para despliegue
└── Documentación técnica

FASE 2 — Consolidación (8 semanas)
├── Módulo de reportes PDF
├── Notificaciones por email
├── Integración contabilidad externa
└── PWA / App móvil básica

FASE 3 — Optimización (continua)
├── Business Intelligence (BI)
├── Integración GPS equipos
├── Facturación electrónica DIAN
└── API pública para terceros
```

### 2.6 Entrega (Delivery)

**Criterios de Aceptación (Definition of Done):**

- [ ] Funcionalidad implementada y probada
- [ ] Cobertura de pruebas ≥ 80%
- [ ] Documentación de API actualizada
- [ ] Revisión de seguridad aprobada
- [ ] Demo aprobada por Product Owner
- [ ] Sin deuda técnica crítica

### 2.7 Incertidumbre y Riesgo (Uncertainty)

Ver sección 11 — Registro de Riesgos.

### 2.8 Valor (Value)

**Métricas de Valor del Negocio:**

| Métrica | Línea Base | Meta 6 meses |
|---------|-----------|--------------|
| Tiempo registro bitácora | 45 min/día | < 10 min/día |
| Errores en nómina | ~5% | < 0.5% |
| Materiales sin registrar | ~20% | < 2% |
| Tiempo cierre contable | 5 días | < 1 día |
| Visibilidad costos proyecto | Semanal | Tiempo real |

---

## 3. ARQUITECTURA DEL SISTEMA

### 3.1 Diagrama de Contexto (C4 — Nivel 1)

```
                         ┌─────────────────────────────┐
                         │        INTERNET              │
                         └──────────────┬──────────────┘
                                        │ HTTPS
                         ┌──────────────▼──────────────┐
                         │                             │
   [Director de Obra]───►│      ConstruGestión         │◄───[Gerente]
   [Residente]──────────►│    Sistema Web / API        │◄───[Contador]
   [Almacenista]────────►│                             │◄───[RRHH]
                         └──────────────┬──────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
             ┌──────▼─────┐    ┌───────▼──────┐    ┌──────▼──────┐
             │ PostgreSQL │    │  Almacenami- │    │  Email /    │
             │   (datos)  │    │  ento Medios │    │  SMTP       │
             └────────────┘    └──────────────┘    └─────────────┘
```

### 3.2 Diagrama de Contenedores (C4 — Nivel 2)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONSTRUGESTIÓN                           │
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────────────────┐ │
│  │   FRONTEND SPA   │  REST    │        BACKEND API           │ │
│  │                  │◄────────►│                              │ │
│  │  React 18        │  JSON    │  Django 5 + DRF              │ │
│  │  TypeScript      │  JWT     │  Python 3.12                 │ │
│  │  Vite + Tailwind │          │  9 Django Apps               │ │
│  │  TanStack Query  │          │  JWT Auth                    │ │
│  │  Zustand         │          │  drf-spectacular (Swagger)   │ │
│  │                  │          │                              │ │
│  │  Puerto: 5173    │          │  Puerto: 8000                │ │
│  └──────────────────┘          └──────────────┬───────────────┘ │
│                                               │ ORM             │
│                                ┌──────────────▼───────────────┐ │
│                                │       PostgreSQL 16           │ │
│                                │                              │ │
│                                │  Puerto: 5432                │ │
│                                │  ~40 tablas                  │ │
│                                └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Diagrama de Componentes (C4 — Nivel 3)

```
BACKEND — Django Apps
┌─────────┐ ┌──────────┐ ┌──────┐ ┌───────────┐ ┌──────────┐
│  users  │ │ projects │ │ logs │ │ equipment │ │warehouse │
│─────────│ │──────────│ │──────│ │───────────│ │──────────│
│ User    │ │ Project  │ │Daily │ │ Equipment │ │ Material │
│ (roles) │ │ Phase    │ │ Log  │ │ Assignment│ │ Supplier │
│ JWT     │ │ Document │ │ Act. │ │ Maint.    │ │ PO       │
└─────────┘ └──────────┘ │ Per. │ │ FuelLog   │ │ Entry    │
                         │ Eq.  │ └───────────┘ │ Exit     │
                         │ Mat. │               └──────────┘
                         │ Inc. │
                         └──────┘
┌──────────┐ ┌────────┐ ┌─────────────┐ ┌────────────────┐
│personnel │ │payroll │ │ accounting  │ │ administration │
│──────────│ │────────│ │─────────────│ │────────────────│
│ Employee │ │ Period │ │ Account     │ │ Client         │
│ Dept.    │ │ Entry  │ │ Journal     │ │ Contractor     │
│ Position │ │ Advanc │ │ Invoice     │ │ Contract       │
│ Document │ └────────┘ │ Expense     │ │ Addendum       │
└──────────┘            │ Budget      │ └────────────────┘
                        └─────────────┘
```

### 3.4 Stack Tecnológico Completo

```
┌──────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN               │
│  React 18 · TypeScript · Vite · Tailwind CSS v4      │
│  TanStack Query · Zustand · React Router · Recharts  │
│  Lucide Icons · React Hook Form · Zod                │
├──────────────────────────────────────────────────────┤
│                    CAPA DE API                        │
│  Django REST Framework · JWT (SimpleJWT)             │
│  drf-spectacular (OpenAPI 3.0) · django-filter       │
│  CORS Headers · Pagination                           │
├──────────────────────────────────────────────────────┤
│                    CAPA DE NEGOCIO                    │
│  Django 5 · Python 3.12 · Custom User Model         │
│  9 Apps modulares · Signals · Validaciones           │
├──────────────────────────────────────────────────────┤
│                    CAPA DE DATOS                      │
│  PostgreSQL 16 · Django ORM · Migraciones            │
│  ~40 modelos · Índices optimizados                   │
├──────────────────────────────────────────────────────┤
│                    INFRAESTRUCTURA                    │
│  Docker · Docker Compose · Nginx · Gunicorn          │
│  Git · GitHub Actions (CI/CD futuro)                 │
└──────────────────────────────────────────────────────┘
```

---

## 4. MÓDULOS DEL SISTEMA

### 4.1 Mapa de Módulos

```
┌─────────────────────────────────────────────────────────────────┐
│                      CONSTRUGESTIÓN                             │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  DASHBOARD  │    │  PROYECTOS  │    │  BITÁCORAS  │         │
│  │  KPIs live  │    │  5 tipos    │    │  Diarias    │         │
│  │  Alertas    │    │  Fases      │    │  Incidentes │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   EQUIPOS   │    │   ALMACÉN   │    │  PERSONAL   │         │
│  │  Pesados    │    │  Materiales │    │  Empleados  │         │
│  │  Camiones   │    │  Inventario │    │  Cargos     │         │
│  │  Combustib. │    │  O. Compra  │    │  RRHH       │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   NÓMINA    │    │CONTABILIDAD │    │ADMINISTRAC. │         │
│  │  Períodos   │    │  Plan Ctas  │    │  Clientes   │         │
│  │  Liquidac.  │    │  Facturas   │    │  Contratist │         │
│  │  Anticipos  │    │  Gastos     │    │  Contratos  │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Descripción Detallada de Módulos

#### M1 — Usuarios y Autenticación
| Atributo | Detalle |
|----------|---------|
| Propósito | Control de acceso, roles y permisos |
| Entidades | User |
| Roles | admin, gerente, director_obra, residente, almacenista, contador, rrhh, operador, conductor, visor |
| Auth | JWT (access 8h, refresh 7 días, rotación automática) |
| Endpoints | `/api/auth/login/`, `/api/auth/refresh/`, `/api/users/` |

#### M2 — Proyectos
| Atributo | Detalle |
|----------|---------|
| Propósito | Ciclo de vida completo de proyectos de construcción |
| Entidades | Project, ProjectPhase, ProjectDocument |
| Tipos | Vías, Movimiento de Tierras, Infraestructura, Residencial, Comercial, Mixto |
| Estados | Licitación → Adjudicado → En Ejecución → Suspendido → Terminado → Liquidado |
| KPIs | Avance físico %, valor contrato, días restantes |

#### M3 — Bitácoras Diarias
| Atributo | Detalle |
|----------|---------|
| Propósito | Registro diario de campo — evidencia técnica y legal |
| Entidades | DailyLog, LogActivity, LogPersonnel, LogEquipment, LogMaterial, LogIncident |
| Unicidad | Una bitácora por proyecto por día |
| Clima | Mañana / tarde con 5 opciones climáticas |
| Incidentes | Clasificados por tipo y severidad (leve→crítico) |

#### M4 — Equipos y Maquinaria
| Atributo | Detalle |
|----------|---------|
| Propósito | Control total del parque de maquinaria y flota |
| Entidades | Equipment, EquipmentAssignment, EquipmentMaintenance, FuelLog |
| Tipos | 15 tipos: excavadora, bulldózer, motoniveladora, compactador, volqueta, etc. |
| Control | Horómetro, mantenimientos preventivos/correctivos, combustible |
| Propiedad | Propio, alquilado, leasing |

#### M5 — Almacén de Materiales
| Atributo | Detalle |
|----------|---------|
| Propósito | Inventario con trazabilidad completa de movimientos |
| Entidades | Material, MaterialCategory, Supplier, PurchaseOrder, PurchaseOrderItem, MaterialEntry, MaterialExit |
| Stock | Actualización automática con entradas/salidas |
| Alertas | Notificación cuando stock ≤ stock mínimo |
| Kardex | Trazabilidad completa entrada/salida por material |

#### M6 — Personal
| Atributo | Detalle |
|----------|---------|
| Propósito | Gestión del talento humano |
| Entidades | Employee, Department, Position, EmployeeDocument |
| Datos clave | EPS, ARL, fondo de pensión, tipo contrato, tipo de salario |
| Estados | Activo, Vacaciones, Licencia, Incapacidad, Retirado |
| Documentos | Contrato, cédula, hoja de vida, exámenes médicos |

#### M7 — Nómina
| Atributo | Detalle |
|----------|---------|
| Propósito | Liquidación de nómina según modelo laboral colombiano |
| Entidades | PayrollPeriod, PayrollEntry, SalaryAdvance |
| Devengado | Salario base + Aux. transporte + Horas extra (diurnas, nocturnas, festivos) + Bonos |
| Deducciones | Salud 4%, Pensión 4%, anticipos, otros |
| Aportes patronales | Salud 8.5%, Pensión 12%, ARL, CCF 4%, ICBF 3%, SENA 2% |

#### M8 — Contabilidad
| Atributo | Detalle |
|----------|---------|
| Propósito | Control financiero completo del negocio |
| Entidades | Account, Journal, JournalEntry, Invoice, InvoiceItem, Expense, Budget |
| Plan de cuentas | Estructura colombiana: Activos, Pasivos, Patrimonio, Ingresos, Costos, Gastos |
| Facturación | Facturas de venta, anticipos, actas de cobro |
| Presupuesto | Control presupuestal por categoría de gasto por proyecto |

#### M9 — Administración
| Atributo | Detalle |
|----------|---------|
| Propósito | Gestión contractual y de terceros |
| Entidades | Client, Contractor, Contract, ContractAddendum |
| Contratos | Principal (cliente), Subcontrato, Suministro, Servicio |
| Otrosíes | Modificaciones de plazo y valor con control de versiones |

---

## 5. MODELO DE DATOS

### 5.1 Diagrama Entidad-Relación (Simplificado)

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│  Client  │────►│   Contract  │◄────│  Contractor  │
└──────────┘     └──────┬──────┘     └──────────────┘
                        │
                   ┌────▼────┐
              ┌────│ Project │────┐
              │    └────┬────┘    │
              │         │        │
        ┌─────▼──┐  ┌───▼────┐  ┌▼────────┐
        │Invoice │  │DailyLog│  │Equipment│
        └────────┘  └───┬────┘  │Assignment
                        │       └─────────┘
              ┌─────────┼─────────┐
              │         │         │
        ┌─────▼──┐ ┌────▼───┐ ┌──▼──────┐
        │LogAct. │ │LogEquip│ │LogMatl. │
        └────────┘ └────────┘ └─────────┘
                                   │
                              ┌────▼────┐
                              │Material │
                              └─────────┘

┌──────────┐     ┌──────────────┐     ┌───────────────┐
│ Employee │────►│ PayrollEntry │◄────│ PayrollPeriod │
└────┬─────┘     └──────────────┘     └───────────────┘
     │
     ├──► Department
     └──► Position
```

### 5.2 Inventario de Entidades

| # | Entidad | App | Campos Clave |
|---|---------|-----|-------------|
| 1 | User | users | username, email, role, phone |
| 2 | Project | projects | code, name, type, status, contract_value, advance% |
| 3 | ProjectPhase | projects | project, name, start_date, end_date, progress% |
| 4 | ProjectDocument | projects | project, doc_type, file |
| 5 | DailyLog | logs | project, date, weather_am, weather_pm |
| 6 | LogActivity | logs | daily_log, description, quantity, unit |
| 7 | LogPersonnel | logs | daily_log, employee, hours_worked |
| 8 | LogEquipment | logs | daily_log, equipment, hours_operated, fuel |
| 9 | LogMaterial | logs | daily_log, material, quantity_used |
| 10 | LogIncident | logs | daily_log, type, severity, description |
| 11 | Equipment | equipment | code, type, brand, model, plate, hourmeter |
| 12 | EquipmentAssignment | equipment | equipment, project, operator, dates |
| 13 | EquipmentMaintenance | equipment | equipment, type, date, cost |
| 14 | FuelLog | equipment | equipment, date, gallons, cost |
| 15 | MaterialCategory | warehouse | name |
| 16 | Material | warehouse | code, name, unit, stock, min_stock |
| 17 | Supplier | warehouse | name, nit, contact |
| 18 | PurchaseOrder | warehouse | number, supplier, project, status, total |
| 19 | PurchaseOrderItem | warehouse | order, material, qty, price |
| 20 | MaterialEntry | warehouse | material, quantity, date, supplier |
| 21 | MaterialExit | warehouse | material, quantity, date, project |
| 22 | Department | personnel | name |
| 23 | Position | personnel | name, department, base_salary |
| 24 | Employee | personnel | code, name, id, position, salary, status |
| 25 | EmployeeDocument | personnel | employee, type, file, expiry |
| 26 | PayrollPeriod | payroll | name, start, end, status, totals |
| 27 | PayrollEntry | payroll | period, employee, devengado, deducciones, neto |
| 28 | SalaryAdvance | payroll | employee, amount, status |
| 29 | Account | accounting | code, name, type, parent |
| 30 | Journal | accounting | number, date, description, status |
| 31 | JournalEntry | accounting | journal, account, debit, credit |
| 32 | Invoice | accounting | number, project, client, dates, total |
| 33 | InvoiceItem | accounting | invoice, description, qty, price |
| 34 | Expense | accounting | project, category, amount, status |
| 35 | Budget | accounting | project, category, budgeted, actual |
| 36 | Client | administration | name, nit, type |
| 37 | Contractor | administration | name, nit, specialty |
| 38 | Contract | administration | number, type, project, value, status |
| 39 | ContractAddendum | administration | contract, number, value_change, days_change |

**Total: 39 entidades / ~40 tablas en base de datos**

---

## 6. ARQUITECTURA DE API

### 6.1 Convención de Endpoints

```
Patrón base:  /api/{módulo}/{recurso}/
Detalle:      /api/{módulo}/{recurso}/{id}/
Acciones:     /api/{módulo}/{recurso}/{id}/{action}/
Auth:         /api/auth/{action}/
Dashboard:    /api/dashboard/
Docs:         /api/docs/
```

### 6.2 Mapa Completo de Endpoints

```
AUTH
├── POST   /api/auth/login/              → Obtener tokens JWT
└── POST   /api/auth/refresh/            → Renovar access token

USERS
├── GET    /api/users/                   → Listar usuarios
├── POST   /api/users/                   → Crear usuario
├── GET    /api/users/{id}/              → Detalle usuario
├── PATCH  /api/users/{id}/              → Actualizar usuario
├── GET    /api/users/me/                → Mi perfil
├── PATCH  /api/users/me/               → Actualizar mi perfil
└── POST   /api/users/change_password/   → Cambiar contraseña

PROYECTOS
├── CRUD   /api/projects/projects/       → Proyectos
├── CRUD   /api/projects/phases/         → Fases
├── CRUD   /api/projects/documents/      → Documentos
└── GET    /api/projects/projects/{id}/summary/ → Resumen ejecutivo

BITÁCORAS
├── CRUD   /api/logs/daily-logs/         → Bitácoras diarias
├── CRUD   /api/logs/activities/         → Actividades
├── CRUD   /api/logs/log-personnel/      → Personal en bitácora
├── CRUD   /api/logs/log-equipment/      → Equipos en bitácora
├── CRUD   /api/logs/log-materials/      → Materiales en bitácora
└── CRUD   /api/logs/incidents/          → Incidentes

EQUIPOS
├── CRUD   /api/equipment/equipment/     → Equipos/Maquinaria
├── CRUD   /api/equipment/assignments/   → Asignaciones
├── CRUD   /api/equipment/maintenance/   → Mantenimientos
├── CRUD   /api/equipment/fuel-logs/     → Combustible
└── GET    /api/equipment/equipment/{id}/history/ → Historial equipo

ALMACÉN
├── CRUD   /api/warehouse/categories/    → Categorías
├── CRUD   /api/warehouse/materials/     → Materiales
├── GET    /api/warehouse/materials/low_stock/ → Bajo stock
├── CRUD   /api/warehouse/suppliers/     → Proveedores
├── CRUD   /api/warehouse/purchase-orders/ → Órdenes de compra
├── CRUD   /api/warehouse/entries/       → Entradas (actualiza stock +)
└── CRUD   /api/warehouse/exits/         → Salidas (actualiza stock -)

PERSONAL
├── CRUD   /api/personnel/departments/   → Departamentos
├── CRUD   /api/personnel/positions/     → Cargos
├── CRUD   /api/personnel/employees/     → Empleados
└── CRUD   /api/personnel/employee-documents/ → Documentos

NÓMINA
├── CRUD   /api/payroll/periods/         → Períodos
├── CRUD   /api/payroll/entries/         → Entradas de nómina
├── CRUD   /api/payroll/advances/        → Anticipos
└── GET    /api/payroll/periods/{id}/summary/ → Resumen período

CONTABILIDAD
├── CRUD   /api/accounting/accounts/     → Plan de cuentas
├── CRUD   /api/accounting/journals/     → Comprobantes
├── CRUD   /api/accounting/invoices/     → Facturas
├── GET    /api/accounting/invoices/overdue/ → Facturas vencidas
├── CRUD   /api/accounting/expenses/     → Gastos
└── CRUD   /api/accounting/budgets/      → Presupuestos

ADMINISTRACIÓN
├── CRUD   /api/admin/clients/           → Clientes
├── CRUD   /api/admin/contractors/       → Contratistas
├── CRUD   /api/admin/contracts/         → Contratos
└── CRUD   /api/admin/addenda/           → Otrosíes

DASHBOARD
└── GET    /api/dashboard/               → KPIs consolidados
```

### 6.3 Estándares de Respuesta

```json
// Listado paginado
{
  "count": 25,
  "next": "/api/projects/projects/?page=2",
  "previous": null,
  "results": [...]
}

// Objeto individual
{
  "id": 1,
  "code": "PRY-2024-001",
  "name": "Rehabilitación Vía...",
  ...
}

// Error de validación
{
  "field_name": ["Este campo es requerido."],
  "non_field_errors": ["Mensaje de error general"]
}

// Error de autenticación
{
  "detail": "Las credenciales de autenticación no se proveyeron.",
  "code": "not_authenticated"
}
```

---

## 7. ARQUITECTURA FRONTEND

### 7.1 Estructura de Directorios

```
frontend/src/
├── api/
│   └── client.ts          → Axios con interceptores JWT
├── components/
│   ├── layout/
│   │   ├── Layout.tsx      → Shell principal con sidebar
│   │   └── Sidebar.tsx     → Navegación lateral
│   └── ui/
│       ├── Badge.tsx       → Etiquetas de estado con color
│       ├── Card.tsx        → Contenedor de secciones
│       └── StatCard.tsx    → Tarjeta de KPI con ícono
├── hooks/                  → Custom hooks (futuro)
├── pages/
│   ├── auth/
│   │   └── Login.tsx       → Pantalla de login
│   ├── Dashboard.tsx       → Dashboard principal
│   ├── projects/
│   ├── logs/
│   ├── equipment/
│   ├── warehouse/
│   ├── personnel/
│   ├── payroll/
│   ├── accounting/
│   └── administration/
├── store/
│   └── authStore.ts        → Estado global auth (Zustand)
├── types/
│   └── index.ts            → TypeScript interfaces
└── App.tsx                 → Router principal
```

### 7.2 Flujo de Estado y Datos

```
┌──────────┐   HTTP/JWT   ┌──────────┐   PostgreSQL   ┌──────────┐
│ Browser  │◄────────────►│  Django  │◄──────────────►│   DB     │
└────┬─────┘              └──────────┘                └──────────┘
     │
     ▼
┌────────────────────────────────────────────┐
│              React App                     │
│                                            │
│  ┌──────────┐   ┌──────────┐              │
│  │ Zustand  │   │ TanStack │              │
│  │  Store   │   │  Query   │              │
│  │          │   │          │              │
│  │ • user   │   │ • cache  │              │
│  │ • isAuth │   │ • fetch  │              │
│  │ • logout │   │ • mutate │              │
│  └──────────┘   └──────────┘              │
│                                            │
│  ┌────────────────────────────────────┐   │
│  │         Páginas / Vistas           │   │
│  │  Dashboard → ProjectList →         │   │
│  │  LogList → EquipmentList → ...     │   │
│  └────────────────────────────────────┘   │
└────────────────────────────────────────────┘
```

### 7.3 Paleta de Diseño

| Elemento | Color | Uso |
|----------|-------|-----|
| Sidebar | `#111827` (gray-900) | Navegación principal |
| Acento | `#FBBF24` (yellow-400) | Botones CTA, item activo |
| Fondo | `#F3F4F6` (gray-100) | Fondo de contenido |
| Cards | `#FFFFFF` | Contenedores de datos |
| Éxito | `#10B981` (green-500) | Estados positivos |
| Alerta | `#EF4444` (red-500) | Errores, alertas críticas |
| Info | `#3B82F6` (blue-500) | Estados informativos |
| Advertencia | `#F59E0B` (amber-500) | Advertencias |

---

## 8. SEGURIDAD Y ROLES

### 8.1 Modelo de Seguridad

```
┌─────────────────────────────────────────────────┐
│                CAPAS DE SEGURIDAD               │
│                                                 │
│  [1] HTTPS / TLS (transporte)                  │
│  [2] JWT Token (autenticación)                  │
│  [3] Roles de Usuario (autorización)            │
│  [4] Validación de inputs (DRF serializers)     │
│  [5] ORM parametrizado (anti SQL injection)     │
│  [6] CORS configurado por origen               │
│  [7] CSRF protection (Django)                   │
└─────────────────────────────────────────────────┘
```

### 8.2 Matriz de Permisos por Módulo

| Módulo | admin | gerente | director_obra | residente | almacenista | contador | rrhh | operador | visor |
|--------|-------|---------|---------------|-----------|-------------|----------|------|----------|-------|
| Usuarios | CRUD | R | R | — | — | — | R | — | — |
| Proyectos | CRUD | CRUD | CRUD | R | R | R | R | R | R |
| Bitácoras | CRUD | R | CRUD | CRUD | R | R | R | R | R |
| Equipos | CRUD | R | CRUD | R | — | R | — | R | R |
| Almacén | CRUD | R | R | R | CRUD | R | — | — | R |
| Personal | CRUD | R | R | — | — | — | CRUD | — | — |
| Nómina | CRUD | R | — | — | — | CRUD | CRUD | — | — |
| Contabilidad | CRUD | R | R | — | — | CRUD | — | — | R |
| Administración | CRUD | CRUD | R | — | — | R | — | — | R |

*CRUD = Crear/Leer/Actualizar/Eliminar · R = Solo lectura · — = Sin acceso*

### 8.3 Flujo JWT

```
Login ──► POST /api/auth/login/
              │
              ▼
         { access: "eyJ..." (8h),
           refresh: "eyJ..." (7 días) }
              │
              ▼
   Almacenar en localStorage
              │
              ▼
   Cada request: Authorization: Bearer {access}
              │
              ▼
   Si 401 → intentar renovar con refresh
              │
              ▼
   Si refresh inválido → logout + redirect /login
```

---

## 9. INFRAESTRUCTURA Y DESPLIEGUE

### 9.1 Entornos

| Entorno | URL | Base de Datos | Descripción |
|---------|-----|---------------|-------------|
| **Desarrollo** | localhost:5173 | PostgreSQL local | Vite dev server + Django runserver |
| **Staging** | staging.construgestion.com | PostgreSQL staging | Docker Compose + Nginx |
| **Producción** | construgestion.com | PostgreSQL managed | Docker + SSL + Backups |

### 9.2 Arquitectura Docker

```
docker-compose.yml
├── db           (postgres:16-alpine)     → Puerto 5432
├── backend      (python:3.12-slim)       → Puerto 8000
│   ├── Gunicorn (WSGI server)
│   └── Django app
└── frontend     (nginx:alpine)           → Puerto 80/443
    ├── Build React estático
    └── Proxy /api/ → backend:8000
```

### 9.3 Variables de Entorno Requeridas

```bash
# Backend
SECRET_KEY=<clave-segura-producción>
DEBUG=False
DB_NAME=construction_db
DB_USER=<usuario-db>
DB_PASSWORD=<password-db>
DB_HOST=<host-db>
DB_PORT=5432
ALLOWED_HOSTS=construgestion.com,www.construgestion.com
CORS_ALLOWED_ORIGINS=https://construgestion.com

# Frontend (build time)
VITE_API_URL=https://construgestion.com/api
```

### 9.4 CI/CD Recomendado (GitHub Actions)

```yaml
on: push to main
  ├── Lint & Type Check (eslint, mypy)
  ├── Tests (pytest, jest)
  ├── Build Docker images
  ├── Push to Registry
  └── Deploy to Server (SSH + docker compose up)
```

---

## 10. ROADMAP DE DESARROLLO

### 10.1 Fases del Producto

```
FASE 1 — MVP ✅ (Completado)
├── Backend Django con 9 módulos
├── API REST completa (~50 endpoints)
├── Frontend React con 9 módulos
├── Autenticación JWT
├── Docker Compose
└── Datos de demostración

FASE 2 — Reportes y Notificaciones (Próxima)
├── Exportación PDF bitácoras / nómina / facturas
├── Notificaciones email (alertas stock, mantenimientos vencidos)
├── Reportes de avance por proyecto
└── Gráficas y charts en Dashboard

FASE 3 — Integración y Automatización
├── Facturación electrónica DIAN (Colombia)
├── Integración contabilidad (Siigo, World Office)
├── Cálculo automático nómina
└── Alertas preventivas mantenimiento (por horómetro)

FASE 4 — Movilidad y BI
├── PWA / App móvil (campo, offline-first)
├── Módulo de Business Intelligence
├── Dashboard ejecutivo con drill-down
└── API pública para integraciones

FASE 5 — Inteligencia Artificial
├── Predicción de sobrecostos por proyecto
├── Optimización de asignación de equipos
├── Análisis de incidentes de seguridad
└── Asistente de consulta en lenguaje natural
```

### 10.2 Backlog Priorizado (MoSCoW)

#### MUST HAVE (Fase 2)
- [ ] Exportar bitácora diaria a PDF firmado
- [ ] Exportar colilla de nómina a PDF por empleado
- [ ] Alerta email cuando material está en stock mínimo
- [ ] Alerta email para mantenimientos próximos a vencer
- [ ] Formularios de creación/edición en frontend (actualmente solo listados)

#### SHOULD HAVE (Fase 2-3)
- [ ] Módulo de Seguridad Industrial (SST) dedicado
- [ ] Gestión de subcontratos con seguimiento de pagos
- [ ] Control de calidad (ensayos de laboratorio)
- [ ] Actas de vecindad y prediales
- [ ] Módulo de licitaciones

#### COULD HAVE (Fase 3-4)
- [ ] Firma digital de documentos
- [ ] Integración GPS para rastreo de equipos
- [ ] Portal del cliente (extranet)
- [ ] Chat interno por proyecto
- [ ] Integración con WhatsApp Business

#### WON'T HAVE (esta versión)
- Contabilidad de costo completa (ERP nivel SAP)
- Módulo de diseño CAD/BIM
- Gestión de múltiples empresas (multitenancy)

---

## 11. RIESGOS DEL PROYECTO

### 11.1 Registro de Riesgos (Risk Register — PMBOK)

| ID | Riesgo | Probabilidad | Impacto | Prioridad | Estrategia | Respuesta |
|----|--------|-------------|---------|-----------|-----------|-----------|
| R01 | Resistencia al cambio del personal de campo | Alta | Alto | **Crítico** | Mitigar | Capacitación intensiva, UX simplificada, soporte in-situ |
| R02 | Conectividad limitada en obras remotas | Media | Alto | **Alto** | Mitigar | PWA offline-first en Fase 4 |
| R03 | Pérdida de datos (falla de servidor) | Baja | Crítico | **Alto** | Mitigar | Backups automáticos diarios, réplica DB |
| R04 | Deuda técnica acumulada por velocidad | Media | Medio | **Medio** | Aceptar | Code reviews, refactoring sprints |
| R05 | Cambios en legislación laboral colombiana | Media | Medio | **Medio** | Mitigar | Módulo nómina parametrizable |
| R06 | Integración fallida con sistemas contables | Baja | Medio | **Bajo** | Mitigar | API bien documentada, conectores estándar |
| R07 | Brecha de seguridad / acceso no autorizado | Baja | Crítico | **Alto** | Mitigar | Auditoría seguridad, penetration testing |
| R08 | Scope creep (expansión descontrolada) | Alta | Medio | **Alto** | Evitar | Change control board, backlog priorizado |

---

## 12. MÉTRICAS DE ÉXITO

### 12.1 KPIs del Producto (OKRs)

**Objetivo 1: Adopción del sistema**
- KR1: 100% de proyectos activos registrados en los primeros 30 días
- KR2: Bitácoras diarias registradas en >90% de días hábiles de obra
- KR3: 0 bitácoras en papel después de semana 8

**Objetivo 2: Eficiencia operacional**
- KR1: Tiempo de registro de bitácora < 10 min/día (vs 45 min actual)
- KR2: Diferencia inventario físico vs sistema < 2%
- KR3: Cero órdenes de compra urgentes por falta de stock

**Objetivo 3: Control financiero**
- KR1: Cierre de nómina en < 4 horas (vs 2 días actual)
- KR2: Visibilidad de costos por proyecto en tiempo real
- KR3: Reducción de errores en nómina a < 0.5%

### 12.2 KPIs Técnicos

| Métrica | Meta |
|---------|------|
| Tiempo de respuesta API (p95) | < 300ms |
| Disponibilidad del sistema | > 99.5% |
| Cobertura de pruebas | > 80% |
| Tiempo de build CI/CD | < 5 min |
| Tamaño bundle frontend | < 500KB gzip |

---

## APÉNDICES

### A. Glosario

| Término | Definición |
|---------|-----------|
| Bitácora | Registro diario de actividades en obra |
| Horómetro | Contador de horas de operación de un equipo |
| Acta de Cobro | Documento de facturación por avance de obra |
| Otrosí | Modificación o adición a un contrato |
| Kardex | Registro histórico de movimientos de inventario |
| SST | Seguridad y Salud en el Trabajo |
| ARL | Administradora de Riesgos Laborales |
| CCF | Caja de Compensación Familiar |
| MDC-19 | Mezcla Densa en Caliente de gradación 19mm |

### B. Referencias PMBOK 7

- Dominio 1: Interesados (Stakeholder Performance Domain)
- Dominio 2: Equipo (Team Performance Domain)
- Dominio 3: Enfoque de Desarrollo (Development Approach & Life Cycle)
- Dominio 4: Planificación (Planning Performance Domain)
- Dominio 5: Trabajo del Proyecto (Project Work Performance Domain)
- Dominio 6: Entrega (Delivery Performance Domain)
- Dominio 7: Incertidumbre (Uncertainty Performance Domain)
- Dominio 8: Valor (Measurement Performance Domain)

### C. Convenciones de Código

**Backend (Python/Django)**
```python
# Modelos: PascalCase
class ProjectPhase(models.Model): ...

# Variables/funciones: snake_case
def get_active_projects(): ...

# Constantes: UPPER_CASE
STATUS_CHOICES = [...]
```

**Frontend (TypeScript/React)**
```typescript
// Componentes: PascalCase
function ProjectList(): JSX.Element { ... }

// Variables/funciones: camelCase
const fetchProjects = async () => { ... }

// Tipos/Interfaces: PascalCase con prefijo I opcional
interface ProjectListProps { ... }
```

---

*Blueprint generado siguiendo PMI/PMBOK 7ª Edición*  
*Sistema ConstruGestión — Voxel Tek — Mayo 2026*
