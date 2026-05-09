import { useQuery } from '@tanstack/react-query'
import { DollarSign } from 'lucide-react'
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
}

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
  pagado: 'green', cerrado: 'blue', procesando: 'yellow', abierto: 'gray'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

export default function PayrollList() {
  const { data, isLoading } = useQuery<PaginatedResponse<PayrollPeriod>>({
    queryKey: ['payroll-periods'],
    queryFn: async () => (await api.get('/payroll/periods/')).data,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nómina</h1>
        <p className="text-gray-500 text-sm">Períodos de nómina</p>
      </div>

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16">
              <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay períodos de nómina.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Período</th>
                    <th className="text-left px-6 py-3">Tipo</th>
                    <th className="text-left px-6 py-3">Inicio</th>
                    <th className="text-left px-6 py-3">Fin</th>
                    <th className="text-right px-6 py-3">Total Devengado</th>
                    <th className="text-right px-6 py-3">Deducciones</th>
                    <th className="text-right px-6 py-3">Neto a Pagar</th>
                    <th className="text-left px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.results.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500 capitalize">{p.period_type}</td>
                      <td className="px-6 py-4 text-gray-500">{format(new Date(p.start_date + 'T12:00:00'), 'dd/MM/yyyy')}</td>
                      <td className="px-6 py-4 text-gray-500">{format(new Date(p.end_date + 'T12:00:00'), 'dd/MM/yyyy')}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-700">{formatCOP(p.total_devengado)}</td>
                      <td className="px-6 py-4 text-right text-red-600">{formatCOP(p.total_deducciones)}</td>
                      <td className="px-6 py-4 text-right font-bold">{formatCOP(p.total_neto)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor[p.status] || 'gray'}>{p.status_display}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
