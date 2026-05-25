import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Plus } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import FormField from '../../components/ui/FormField'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray'> = {
  pagado: 'green', cerrado: 'blue', procesando: 'yellow', abierto: 'gray'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

interface PayrollPeriod {
  id: number
  name: string
  period_type: string
  start_date: string
  end_date: string
  status: string
  status_display: string
  total_devengado: string
  total_deducciones: string
  total_neto: string
}

interface PayrollEntry {
  id: number
  employee_name: string
  base_salary: string
  transport_allowance: string
  overtime_hours: string
  overtime_rate: string
  bonuses: string
  health_deduction: string
  pension_deduction: string
  deductions_other: string
  net_pay: string
}

interface Employee { id: number; full_name: string; base_salary: string }

const entrySchema = z.object({
  employee: z.string().min(1, 'Requerido'),
  base_salary: z.string().min(1, 'Requerido'),
  transport_allowance: z.string().optional(),
  overtime_hours: z.string().optional(),
  overtime_rate: z.string().optional(),
  bonuses: z.string().optional(),
  deductions_other: z.string().optional(),
})
type EntryForm = z.infer<typeof entrySchema>

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function PayrollPeriodDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showEntryModal, setShowEntryModal] = useState(false)

  const { data: period, isLoading } = useQuery<PayrollPeriod>({
    queryKey: ['payroll-period', id],
    queryFn: async () => (await api.get(`/payroll/periods/${id}/`)).data,
  })

  const { data: entries } = useQuery<PayrollEntry[]>({
    queryKey: ['payroll-entries', id],
    queryFn: async () => (await api.get('/payroll/entries/', { params: { period: id } })).data,
  })

  const { data: employees } = useQuery<{ results: Employee[] }>({
    queryKey: ['employees-select'],
    queryFn: async () => (await api.get('/personnel/employees/', { params: { status: 'activo' } })).data,
  })

  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<EntryForm>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      transport_allowance: '0',
      overtime_hours: '0',
      overtime_rate: '0',
      bonuses: '0',
      deductions_other: '0',
    },
  })

  const watchedValues = useWatch({ control })

  const baseSalary = Number(watchedValues.base_salary || 0)
  const transportAllowance = Number(watchedValues.transport_allowance || 0)
  const overtimeHours = Number(watchedValues.overtime_hours || 0)
  const overtimeRate = Number(watchedValues.overtime_rate || 0)
  const bonuses = Number(watchedValues.bonuses || 0)
  const deductionsOther = Number(watchedValues.deductions_other || 0)

  const overtimePay = overtimeHours * overtimeRate
  const grossPay = baseSalary + transportAllowance + overtimePay + bonuses
  const healthDeduction = baseSalary * 0.04
  const pensionDeduction = baseSalary * 0.04
  const totalDeductions = healthDeduction + pensionDeduction + deductionsOther
  const netPay = grossPay - totalDeductions

  const entryMutation = useMutation({
    mutationFn: async (data: EntryForm) => {
      return (await api.post('/payroll/entries/', {
        ...data,
        period: Number(id),
        employee: Number(data.employee),
        base_salary: data.base_salary,
        transport_allowance: data.transport_allowance || '0',
        overtime_hours: data.overtime_hours || '0',
        overtime_rate: data.overtime_rate || '0',
        bonuses: data.bonuses || '0',
        deductions_other: data.deductions_other || '0',
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-entries', id] })
      queryClient.invalidateQueries({ queryKey: ['payroll-period', id] })
      setShowEntryModal(false)
      reset()
    },
  })

  const handleEmployeeChange = (employeeId: string) => {
    const emp = employees?.results.find((e) => e.id === Number(employeeId))
    if (emp) setValue('base_salary', emp.base_salary)
  }

  if (isLoading) return <div className="text-center py-20 text-gray-400">Cargando...</div>
  if (!period) return <div className="text-center py-20 text-gray-500">Período no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/payroll')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{period.name}</h1>
              <Badge variant={statusColor[period.status] || 'gray'}>{period.status_display}</Badge>
            </div>
            <p className="text-gray-500 text-sm">{period.start_date} — {period.end_date} · {period.period_type}</p>
          </div>
        </div>
        <button onClick={() => setShowEntryModal(true)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
          <Plus size={16} />Agregar Empleado
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardBody><p className="text-xs text-gray-500">Total Devengado</p><p className="text-lg font-bold text-green-700">{formatCOP(period.total_devengado)}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs text-gray-500">Total Deducciones</p><p className="text-lg font-bold text-red-600">{formatCOP(period.total_deducciones)}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs text-gray-500">Neto a Pagar</p><p className="text-lg font-bold text-gray-900">{formatCOP(period.total_neto)}</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Empleados en este período</h2>
        </CardHeader>
        <CardBody className="p-0">
          {!entries?.length ? (
            <p className="text-center py-10 text-gray-400">No hay empleados en este período</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Empleado</th>
                  <th className="text-right px-6 py-3">Salario</th>
                  <th className="text-right px-6 py-3">Bonos</th>
                  <th className="text-right px-6 py-3">Deducciones</th>
                  <th className="text-right px-6 py-3">Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{e.employee_name}</td>
                    <td className="px-6 py-4 text-right">{formatCOP(e.base_salary)}</td>
                    <td className="px-6 py-4 text-right text-green-700">{formatCOP(e.bonuses)}</td>
                    <td className="px-6 py-4 text-right text-red-600">{formatCOP(Number(e.health_deduction) + Number(e.pension_deduction) + Number(e.deductions_other))}</td>
                    <td className="px-6 py-4 text-right font-bold">{formatCOP(e.net_pay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={showEntryModal} onClose={() => setShowEntryModal(false)} title="Agregar Empleado a Nómina" size="md">
        <form onSubmit={handleSubmit((d) => entryMutation.mutate(d))} className="space-y-4">
          <FormField label="Empleado" required error={errors.employee?.message}>
            <select {...register('employee')} className={inputClass} onChange={(e) => { register('employee').onChange(e); handleEmployeeChange(e.target.value) }}>
              <option value="">Seleccionar empleado...</option>
              {employees?.results.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Salario Base" required error={errors.base_salary?.message}>
              <input {...register('base_salary')} type="number" step="1" className={inputClass} />
            </FormField>
            <FormField label="Auxilio de Transporte" error={errors.transport_allowance?.message}>
              <input {...register('transport_allowance')} type="number" step="1" className={inputClass} />
            </FormField>
            <FormField label="Horas Extra" error={errors.overtime_hours?.message}>
              <input {...register('overtime_hours')} type="number" step="0.5" className={inputClass} />
            </FormField>
            <FormField label="Tasa Hora Extra" error={errors.overtime_rate?.message}>
              <input {...register('overtime_rate')} type="number" step="1" className={inputClass} />
            </FormField>
            <FormField label="Bonificaciones" error={errors.bonuses?.message}>
              <input {...register('bonuses')} type="number" step="1" className={inputClass} />
            </FormField>
            <FormField label="Otras Deducciones" error={errors.deductions_other?.message}>
              <input {...register('deductions_other')} type="number" step="1" className={inputClass} />
            </FormField>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Pago por horas extra</span><span>{formatCOP(overtimePay)}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium border-t border-gray-200 pt-2">
              <span>Subtotal devengado</span><span>{formatCOP(grossPay)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Salud (4%)</span><span>-{formatCOP(healthDeduction)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Pensión (4%)</span><span>-{formatCOP(pensionDeduction)}</span>
            </div>
            {deductionsOther > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Otras deducciones</span><span>-{formatCOP(deductionsOther)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-300 pt-2">
              <span>Neto a Pagar</span><span className="text-green-700">{formatCOP(netPay)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowEntryModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm">Cancelar</button>
            <button type="submit" disabled={entryMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {entryMutation.isPending ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
