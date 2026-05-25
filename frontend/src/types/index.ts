export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Project {
  id: number
  code: string
  name: string
  project_type: string
  project_type_display: string
  status: string
  status_display: string
  description: string
  location: string
  municipality: string
  department: string
  start_date: string
  end_date: string
  contract_value: string
  advance_percentage: string
  director: number
  director_name: string
  resident: number | null
  resident_name: string | null
  created_at: string
}

export interface Employee {
  id: number
  employee_code: string
  full_name: string
  first_name: string
  last_name: string
  id_number: string
  department_name: string
  position_name: string
  status: string
  status_display: string
  base_salary: string
  phone: string
  email: string
  hire_date: string
}

export interface Equipment {
  id: number
  code: string
  name: string
  equipment_type: string
  equipment_type_display: string
  brand: string
  model: string
  plate: string
  status: string
  status_display: string
  ownership: string
  current_hourmeter: string
  fuel_type: string
  insurance_expiry: string | null
}

export interface Material {
  id: number
  code: string
  name: string
  category: number
  category_name: string
  unit: string
  unit_price: string
  current_stock: string
  minimum_stock: string
  is_low_stock: boolean
}

export interface DailyLog {
  id: number
  project: number
  project_name: string
  project_code: string
  date: string
  weather_morning: string
  weather_afternoon: string
  general_notes: string
  created_by_name: string
  created_at: string
  activities_count: number
  incidents_count: number
}

export interface Invoice {
  id: number
  invoice_number: string
  invoice_type: string
  project: number
  project_name: string
  client: number
  client_name: string
  issue_date: string
  due_date: string
  status: string
  status_display: string
  total: string
  paid_amount: string
  balance: string
}

export interface Expense {
  id: number
  project: number | null
  project_name: string | null
  category: string
  category_display: string
  description: string
  amount: string
  expense_date: string
  status: string
  status_display: string
}

export interface ProjectPhase {
  id: number
  project: number
  name: string
  description: string
  planned_start: string
  planned_end: string
  actual_start: string | null
  actual_end: string | null
  status: string
  progress_percentage: string
}

export interface EquipmentMaintenance {
  id: number
  equipment: number
  equipment_name: string
  maintenance_type: string
  maintenance_type_display: string
  description: string
  scheduled_date: string
  completion_date: string | null
  cost: string
  status: string
  hours_at_maintenance: string | null
  next_maintenance_hours: string | null
}

export interface FuelLog {
  id: number
  equipment: number
  equipment_name: string
  date: string
  gallons: string
  unit_cost: string
  total_cost: string
  hourmeter: string | null
  mileage: string | null
  fuel_station: string
  project: number | null
  project_name: string | null
}

export interface PayrollPeriod {
  id: number
  name: string
  period_type: string
  start_date: string
  end_date: string
  payment_date: string | null
  status: string
  status_display: string
  total_devengado: string
  total_deducciones: string
  total_neto: string
}

export interface PayrollEntry {
  id: number
  period: number
  employee: number
  employee_name: string
  employee_code: string
  days_worked: string
  base_salary: string
  transportation_allowance: string
  extra_pay: string
  bonuses: string
  total_devengado: string
  health_deduction: string
  pension_deduction: string
  other_deductions: string
  advances: string
  total_deductions: string
  net_pay: string
  employer_health: string
  employer_pension: string
  arl: string
  ccf: string
  icbf: string
  sena: string
  notes: string
}

export interface Client {
  id: number
  name: string
  nit: string
  address: string
  city: string
  phone: string
  email: string
  contact_person: string
  notes: string
  is_active: boolean
}

export interface Contractor {
  id: number
  name: string
  nit: string
  specialty: string
  contact_person: string
  phone: string
  email: string
  address: string
  notes: string
  is_active: boolean
}

export interface Contract {
  id: number
  contract_number: string
  project: number
  project_name: string
  contractor: number
  contractor_name: string
  contract_type: string
  description: string
  start_date: string
  end_date: string
  value: string
  retention_percentage: string
  status: string
  status_display: string
}

export interface MaterialCategory {
  id: number
  name: string
  description: string
}

export interface Supplier {
  id: number
  name: string
  nit: string
  contact_person: string
  phone: string
  email: string
  city: string
  is_active: boolean
}

export interface MaterialEntry {
  id: number
  material: number
  material_name: string
  quantity: string
  unit_price: string
  total_cost: string
  date: string
  supplier: number | null
  supplier_name: string | null
  notes: string
}

export interface MaterialExit {
  id: number
  material: number
  material_name: string
  quantity: string
  date: string
  project: number | null
  project_name: string | null
  purpose: string
  notes: string
}

export interface LogActivity {
  id: number
  daily_log: number
  activity_type: string
  description: string
  quantity: string | null
  unit: string
  start_time: string | null
  end_time: string | null
}

export interface LogIncident {
  id: number
  daily_log: number
  incident_type: string
  severity: string
  severity_display: string
  description: string
  injured_person: string
  corrective_action: string
  reported_at: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  role_display: string
  phone: string
  is_active: boolean
}

export interface DashboardData {
  projects: {
    active: number
    by_status: { status: string; count: number }[]
    total_contract_value: number
  }
  equipment: {
    by_status: { status: string; count: number }[]
  }
  personnel: {
    active_employees: number
  }
  warehouse: {
    low_stock_count: number
  }
  financial: {
    monthly_invoiced: number
    monthly_expenses: number
    overdue_invoices: number
  }
  recent_logs: { id: number; project: string; project_code: string; date: string }[]
  recent_incidents: { id: number; project: string; type: string; severity: string; date: string }[]
}
