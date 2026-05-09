import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import type { PaginatedResponse, Invoice, Expense } from '../../types'

const invoiceStatusColor: Record<string, any> = {
  pagada: 'green', enviada: 'blue', borrador: 'gray', vencida: 'red', pagada_parcial: 'yellow', anulada: 'gray'
}
const expenseStatusColor: Record<string, any> = {
  pagado: 'green', aprobado: 'blue', pendiente: 'yellow', rechazado: 'red'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

export default function AccountingList() {
  const { data: invoices } = useQuery<PaginatedResponse<Invoice>>({
    queryKey: ['invoices'],
    queryFn: async () => (await api.get('/accounting/invoices/')).data,
  })
  const { data: expenses } = useQuery<PaginatedResponse<Expense>>({
    queryKey: ['expenses'],
    queryFn: async () => (await api.get('/accounting/expenses/')).data,
  })
  const { data: overdueInvoices } = useQuery<Invoice[]>({
    queryKey: ['invoices-overdue'],
    queryFn: async () => (await api.get('/accounting/invoices/overdue/')).data,
  })

  const totalInvoiced = invoices?.results.reduce((s, i) => s + Number(i.total), 0) || 0
  const totalExpenses = expenses?.results.filter(e => e.status === 'pagado').reduce((s, e) => s + Number(e.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
        <p className="text-gray-500 text-sm">Facturas, gastos y presupuestos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Facturado" value={formatCOP(totalInvoiced)} icon={TrendingUp} color="bg-green-500" />
        <StatCard title="Total Gastos (pagados)" value={formatCOP(totalExpenses)} icon={TrendingDown} color="bg-red-500" />
        <StatCard title="Facturas Vencidas" value={overdueInvoices?.length ?? 0} icon={AlertCircle} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Facturas Recientes</h2>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Factura</th>
                  <th className="text-left px-4 py-3">Cliente</th>
                  <th className="text-right px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices?.results.slice(0, 8).map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-blue-600">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-32 truncate">{inv.client_name}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCOP(inv.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={invoiceStatusColor[inv.status]}>{inv.status_display}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Gastos Recientes</h2>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Descripción</th>
                  <th className="text-left px-4 py-3">Categoría</th>
                  <th className="text-right px-4 py-3">Monto</th>
                  <th className="text-left px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses?.results.slice(0, 8).map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 max-w-32 truncate">{exp.description}</td>
                    <td className="px-4 py-3 text-gray-500">{exp.category_display}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCOP(exp.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={expenseStatusColor[exp.status]}>{exp.status_display}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
