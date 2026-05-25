import { useQuery } from '@tanstack/react-query'
import { FolderOpen, Truck, Users, Package, BookOpen, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { Link } from 'react-router-dom'
import api from '../api/client'
import StatCard from '../components/ui/StatCard'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import type { DashboardData } from '../types'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

const severityColor: Record<string, 'red' | 'orange' | 'yellow' | 'gray'> = {
  critico: 'red', grave: 'orange', moderado: 'yellow', leve: 'gray'
}

const STATUS_COLORS: Record<string, string> = {
  en_ejecucion: '#10B981', adjudicado: '#3B82F6', licitacion: '#F59E0B',
  suspendido: '#EF4444', terminado: '#6B7280', liquidado: '#9CA3AF',
  disponible: '#10B981', asignado: '#3B82F6', mantenimiento: '#F59E0B',
  danado: '#EF4444', inactivo: '#6B7280',
}

const PIE_FALLBACK = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#6B7280', '#8B5CF6']

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard/')).data,
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400 text-sm">Cargando dashboard...</div>
      </div>
    )
  }

  const d = data!

  const projectChartData = d.projects.by_status.map(({ status, count }) => ({
    name: status.replace('_', ' '),
    value: count,
    fill: STATUS_COLORS[status] || '#6B7280',
  }))

  const equipmentChartData = d.equipment.by_status.map(({ status, count }) => ({
    name: status.replace('_', ' '),
    Equipos: count,
  }))

  const financialBar = [
    { name: 'Facturado', value: d.financial.monthly_invoiced, fill: '#10B981' },
    { name: 'Gastos', value: d.financial.monthly_expenses, fill: '#EF4444' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">{format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Proyectos Activos"
          value={d.projects.active}
          icon={FolderOpen}
          color="bg-blue-500"
          subtitle={formatCurrency(d.projects.total_contract_value) + ' en contratos'}
        />
        <StatCard
          title="Empleados Activos"
          value={d.personnel.active_employees}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Facturado (mes)"
          value={formatCurrency(d.financial.monthly_invoiced)}
          icon={DollarSign}
          color="bg-yellow-500"
          subtitle={d.financial.overdue_invoices > 0 ? `${d.financial.overdue_invoices} facturas vencidas` : 'Al día'}
        />
        <StatCard
          title="Materiales Bajo Stock"
          value={d.warehouse.low_stock_count}
          icon={Package}
          color={d.warehouse.low_stock_count > 0 ? 'bg-red-500' : 'bg-gray-400'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Financial bar */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Financiero del Mes
            </h2>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={financialBar} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {financialBar.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Projects pie */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen size={18} className="text-blue-500" />
              Proyectos por Estado
            </h2>
          </CardHeader>
          <CardBody>
            {projectChartData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={projectChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {projectChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill || PIE_FALLBACK[i % PIE_FALLBACK.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Equipment bar */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-green-500" />
              Equipos por Estado
            </h2>
          </CardHeader>
          <CardBody>
            {equipmentChartData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Sin datos</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={equipmentChartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="Equipos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Bitácoras Recientes (7 días)
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            {d.recent_logs.length === 0 ? (
              <p className="text-gray-400 text-sm px-6 py-8 text-center">No hay bitácoras recientes.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Proyecto</th>
                    <th className="text-left px-6 py-3">Código</th>
                    <th className="text-left px-6 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {d.recent_logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{log.project}</td>
                      <td className="px-6 py-3">
                        <Link to="/logs" className="text-blue-600 hover:underline font-mono text-xs">{log.project_code}</Link>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {format(new Date(log.date + 'T12:00:00'), 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              Incidentes Recientes
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            {d.recent_incidents.length === 0 ? (
              <p className="text-gray-400 text-sm px-6 py-8 text-center">Sin incidentes recientes.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {d.recent_incidents.map((inc) => (
                  <div key={inc.id} className="px-6 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{inc.project}</span>
                      <Badge variant={severityColor[inc.severity] || 'gray'}>{inc.severity}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{inc.type?.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-400">{format(new Date(inc.date + 'T12:00:00'), 'dd/MM/yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
