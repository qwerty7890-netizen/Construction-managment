import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'

// Projects
import ProjectList from './pages/projects/ProjectList'
import ProjectForm from './pages/projects/ProjectForm'
import ProjectDetail from './pages/projects/ProjectDetail'

// Logs
import LogList from './pages/logs/LogList'
import LogForm from './pages/logs/LogForm'

// Equipment
import EquipmentList from './pages/equipment/EquipmentList'
import EquipmentForm from './pages/equipment/EquipmentForm'
import EquipmentDetail from './pages/equipment/EquipmentDetail'

// Warehouse
import WarehouseList from './pages/warehouse/WarehouseList'
import MaterialForm from './pages/warehouse/MaterialForm'
import MaterialEntryForm from './pages/warehouse/MaterialEntryForm'
import MaterialExitForm from './pages/warehouse/MaterialExitForm'

// Personnel
import PersonnelList from './pages/personnel/PersonnelList'
import PersonnelForm from './pages/personnel/PersonnelForm'
import PersonnelDetail from './pages/personnel/PersonnelDetail'

// Payroll
import PayrollList from './pages/payroll/PayrollList'
import PayrollPeriodForm from './pages/payroll/PayrollPeriodForm'
import PayrollPeriodDetail from './pages/payroll/PayrollPeriodDetail'

// Accounting
import AccountingList from './pages/accounting/AccountingList'
import InvoiceForm from './pages/accounting/InvoiceForm'
import ExpenseForm from './pages/accounting/ExpenseForm'

// Administration
import AdministrationList from './pages/administration/AdministrationList'
import ClientForm from './pages/administration/ClientForm'
import ContractorForm from './pages/administration/ContractorForm'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />

            {/* Logs */}
            <Route path="logs" element={<LogList />} />
            <Route path="logs/new" element={<LogForm />} />

            {/* Equipment */}
            <Route path="equipment" element={<EquipmentList />} />
            <Route path="equipment/new" element={<EquipmentForm />} />
            <Route path="equipment/:id" element={<EquipmentDetail />} />
            <Route path="equipment/:id/edit" element={<EquipmentForm />} />

            {/* Warehouse */}
            <Route path="warehouse" element={<WarehouseList />} />
            <Route path="warehouse/materials/new" element={<MaterialForm />} />
            <Route path="warehouse/entries/new" element={<MaterialEntryForm />} />
            <Route path="warehouse/exits/new" element={<MaterialExitForm />} />

            {/* Personnel */}
            <Route path="personnel" element={<PersonnelList />} />
            <Route path="personnel/new" element={<PersonnelForm />} />
            <Route path="personnel/:id" element={<PersonnelDetail />} />
            <Route path="personnel/:id/edit" element={<PersonnelForm />} />

            {/* Payroll */}
            <Route path="payroll" element={<PayrollList />} />
            <Route path="payroll/periods/new" element={<PayrollPeriodForm />} />
            <Route path="payroll/periods/:id" element={<PayrollPeriodDetail />} />

            {/* Accounting */}
            <Route path="accounting" element={<AccountingList />} />
            <Route path="accounting/invoices/new" element={<InvoiceForm />} />
            <Route path="accounting/expenses/new" element={<ExpenseForm />} />

            {/* Administration */}
            <Route path="administration" element={<AdministrationList />} />
            <Route path="administration/clients/new" element={<ClientForm />} />
            <Route path="administration/contractors/new" element={<ContractorForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
