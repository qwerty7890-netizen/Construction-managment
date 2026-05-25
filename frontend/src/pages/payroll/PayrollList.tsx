import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { DollarSign, Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import type { PaginatedResponse } from '../../types'

interface PayrollPeriod {
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
  entries_count?: number
}

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
  pagado: 'green', cerrado: 'blue', procesando: 'yellow', abierto: 'gray'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

function safeDate(d: string) {
  try { return format(new Date(d + 'T12:00:00'), 'dd/MM/yyyy') } catch { return d }
}

export default function PayrollList() {
  const { data, isLoading } = useQuery<PaginatedResponse<PayrollPeriod>>({
    queryKey: ['payroll-periods'],
    queryFn: async () => (await api.get('/payroll/periods/')).data,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nómina</h1>
          <p className="text-gray-500 text-sm">{data?.count ?? 0} períodos registrados</p>
        </div>
        <Link
          to="/payroll/periods/new"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg"
        >
          <Plus size={18} />Nuevo Período
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center py-10 text-gray-400">Cargando...</p>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-16">
          <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay períodos de nómina.</p>
          <Link to="/payroll/periods/new" className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
            Crear primer período
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.results.map((p) => (
            <Link key={p.id} to={`/payroll/periods/${p.id}`} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</h3>
                    <Badge variant={statusColor[p.status] || 'gray'}>{p.status_display}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Calendar size={13} />
                    <span>{safeDate(p.start_date)} — {safeDate(p.end_date)}</span>
                  </div>
                  <p className="text-xs text-gray-400 capitalize mb-4">{p.period_type}</p>
                  <div className="border-t border-gray-100 pt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Devengado</span>
                      <span className="font-medium text-green-700">{formatCOP(p.total_devengado)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Deducciones</span>
                      <span className="font-medium text-red-600">{formatCOP(p.total_deducciones)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700">Neto a Pagar</span>
                      <span className="text-gray-900">{formatCOP(p.total_neto)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
