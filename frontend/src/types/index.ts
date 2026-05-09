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
