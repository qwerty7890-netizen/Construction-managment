import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import ProjectList from './pages/projects/ProjectList'
import LogList from './pages/logs/LogList'
import EquipmentList from './pages/equipment/EquipmentList'
import WarehouseList from './pages/warehouse/WarehouseList'
import PersonnelList from './pages/personnel/PersonnelList'
import PayrollList from './pages/payroll/PayrollList'
import AccountingList from './pages/accounting/AccountingList'
import AdministrationList from './pages/administration/AdministrationList'

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
            <Route path="projects" element={<ProjectList />} />
            <Route path="logs" element={<LogList />} />
            <Route path="equipment" element={<EquipmentList />} />
            <Route path="warehouse" element={<WarehouseList />} />
            <Route path="personnel" element={<PersonnelList />} />
            <Route path="payroll" element={<PayrollList />} />
            <Route path="accounting" element={<AccountingList />} />
            <Route path="administration" element={<AdministrationList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
