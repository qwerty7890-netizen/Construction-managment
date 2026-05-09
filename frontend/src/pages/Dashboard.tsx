import { useQuery } from '@tanstack/react-query'
import { FolderOpen, Truck, Users, Package, BookOpen, DollarSign, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
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

export default function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard/')).data,
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando dashboard...</div>
      </div>
    )
  }

  const d = data!

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">{format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es })}</p>
      </div>

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
          subtitle={`${d.financial.overdue_invoices} facturas vencidas`}
        />
        <StatCard
          title="Materiales Bajo Stock"
          value={d.warehouse.low_stock_count}
          icon={Package}
          color="bg-red-500"
        />
      </div>

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
              <p className="text-gray-400 text-sm px-6 py-4">No hay bitácoras recientes.</p>
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
                      <td className="px-6 py-3 text-gray-500">{log.project_code}</td>
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
              <p className="text-gray-400 text-sm px-6 py-4">Sin incidentes recientes.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {d.recent_incidents.map((inc) => (
                  <div key={inc.id} className="px-6 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{inc.project}</span>
                      <Badge variant={severityColor[inc.severity] || 'gray'}>{inc.severity}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{inc.type}</p>
                    <p className="text-xs text-gray-400">{format(new Date(inc.date + 'T12:00:00'), 'dd/MM/yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FolderOpen size={18} className="text-blue-500" />
              Proyectos por Estado
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {d.projects.by_status.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-green-500" />
              Equipos por Estado
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {d.equipment.by_status.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
