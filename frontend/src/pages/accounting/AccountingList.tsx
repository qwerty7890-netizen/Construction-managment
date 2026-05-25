import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, AlertCircle, Plus } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import type { PaginatedResponse, Invoice, Expense } from '../../types'

const invoiceStatusColor: Record<string, 'green' | 'blue' | 'gray' | 'red' | 'yellow'> = {
  pagada: 'green', enviada: 'blue', borrador: 'gray', vencida: 'red', pagada_parcial: 'yellow', anulada: 'gray'
}
const expenseStatusColor: Record<string, 'green' | 'blue' | 'yellow' | 'red' | 'gray'> = {
  pagado: 'green', aprobado: 'blue', pendiente: 'yellow', rechazado: 'red'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

export default function AccountingList() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices')

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-500 text-sm">Facturas, gastos y presupuestos</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'invoices' ? (
            <Link to="/accounting/invoices/new" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={18} />Nueva Factura
            </Link>
          ) : (
            <Link to="/accounting/expenses/new" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={18} />Nuevo Gasto
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Facturado" value={formatCOP(totalInvoiced)} icon={TrendingUp} color="bg-green-500" />
        <StatCard title="Total Gastos (pagados)" value={formatCOP(totalExpenses)} icon={TrendingDown} color="bg-red-500" />
        <StatCard title="Facturas Vencidas" value={overdueInvoices?.length ?? 0} icon={AlertCircle} color="bg-orange-500" />
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['invoices', 'expenses'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'invoices' ? `Facturas (${invoices?.count ?? 0})` : `Gastos (${expenses?.count ?? 0})`}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'invoices' && (
        <Card>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Factura</th>
                  <th className="text-left px-6 py-3">Tipo</th>
                  <th className="text-left px-6 py-3">Cliente</th>
                  <th className="text-left px-6 py-3">Proyecto</th>
                  <th className="text-left px-6 py-3">Emisión</th>
                  <th className="text-left px-6 py-3">Vencimiento</th>
                  <th className="text-right px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices?.results.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-blue-600">{inv.invoice_number}</td>
                    <td className="px-6 py-3 text-gray-500 capitalize">{inv.invoice_type}</td>
                    <td className="px-6 py-3 text-gray-700 max-w-32 truncate">{inv.client_name}</td>
                    <td className="px-6 py-3 text-gray-500">{inv.project_name || '—'}</td>
                    <td className="px-6 py-3 text-gray-500">{inv.issue_date}</td>
                    <td className="px-6 py-3 text-gray-500">{inv.due_date}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCOP(inv.total)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={invoiceStatusColor[inv.status] || 'gray'}>{inv.status_display}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!invoices?.results.length && (
              <p className="text-center py-10 text-gray-400">No hay facturas registradas</p>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'expenses' && (
        <Card>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Descripción</th>
                  <th className="text-left px-6 py-3">Categoría</th>
                  <th className="text-left px-6 py-3">Proyecto</th>
                  <th className="text-left px-6 py-3">Fecha</th>
                  <th className="text-right px-6 py-3">Monto</th>
                  <th className="text-left px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses?.results.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700 max-w-48 truncate">{exp.description}</td>
                    <td className="px-6 py-3 text-gray-500">{exp.category_display}</td>
                    <td className="px-6 py-3 text-gray-500">{exp.project_name || '—'}</td>
                    <td className="px-6 py-3 text-gray-500">{exp.expense_date}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatCOP(exp.amount)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={expenseStatusColor[exp.status] || 'gray'}>{exp.status_display}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!expenses?.results.length && (
              <p className="text-center py-10 text-gray-400">No hay gastos registrados</p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
