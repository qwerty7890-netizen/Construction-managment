import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.string().min(1),
  unit_price: z.string().min(1),
})

const schema = z.object({
  invoice_number: z.string().min(1, 'Requerido'),
  invoice_type: z.string().min(1, 'Requerido'),
  client: z.string().optional(),
  project: z.string().optional(),
  issue_date: z.string().min(1, 'Requerido'),
  due_date: z.string().min(1, 'Requerido'),
  tax_rate: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, 'Agregue al menos un ítem'),
})

type FormValues = z.infer<typeof schema>

interface Client { id: number; name: string }
interface Project { id: number; name: string; code: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)
}

export default function InvoiceForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: clients } = useQuery<{ results: Client[] }>({
    queryKey: ['clients'],
    queryFn: async () => (await api.get('/admin/clients/')).data,
  })

  const { data: projects } = useQuery<{ results: Project[] }>({
    queryKey: ['projects-select'],
    queryFn: async () => (await api.get('/projects/projects/')).data,
  })

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoice_type: 'venta',
      tax_rate: '19',
      line_items: [{ description: '', quantity: '1', unit_price: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'line_items' })
  const watchedItems = useWatch({ control, name: 'line_items' })
  const watchedTaxRate = useWatch({ control, name: 'tax_rate' })

  const subtotal = watchedItems?.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.unit_price || 0)
  }, 0) || 0
  const taxRate = Number(watchedTaxRate || 19) / 100
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/accounting/invoices/', {
        invoice_number: data.invoice_number,
        invoice_type: data.invoice_type,
        client: data.client ? Number(data.client) : null,
        project: data.project ? Number(data.project) : null,
        issue_date: data.issue_date,
        due_date: data.due_date,
        tax_rate: data.tax_rate || '19',
        line_items: data.line_items,
        subtotal: String(subtotal),
        tax_amount: String(tax),
        total: String(total),
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      navigate('/accounting')
    },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/accounting')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
          <p className="text-gray-500 text-sm">Cree una nueva factura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Información de la Factura</h2></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Número de Factura" required error={errors.invoice_number?.message}>
              <input {...register('invoice_number')} className={inputClass} placeholder="FV-2025-001" />
            </FormField>
            <FormField label="Tipo de Factura" required error={errors.invoice_type?.message}>
              <select {...register('invoice_type')} className={inputClass}>
                <option value="venta">Venta</option>
                <option value="compra">Compra</option>
                <option value="anticipo">Anticipo</option>
              </select>
            </FormField>
            <FormField label="Cliente" error={errors.client?.message}>
              <select {...register('client')} className={inputClass}>
                <option value="">Seleccionar cliente...</option>
                {clients?.results.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Proyecto (opcional)" error={errors.project?.message}>
              <select {...register('project')} className={inputClass}>
                <option value="">Ninguno</option>
                {projects?.results.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Fecha de Emisión" required error={errors.issue_date?.message}>
              <input {...register('issue_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Fecha de Vencimiento" required error={errors.due_date?.message}>
              <input {...register('due_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Tasa de IVA (%)" error={errors.tax_rate?.message}>
              <input {...register('tax_rate')} type="number" step="0.1" className={inputClass} placeholder="19" />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Ítems de la Factura</h2>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: '1', unit_price: '' })}
              className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              <Plus size={16} />Agregar ítem
            </button>
          </CardHeader>
          <CardBody className="space-y-3">
            {(errors.line_items as any)?.message && (
              <p className="text-xs text-red-500">{(errors.line_items as any).message}</p>
            )}
            {fields.map((field, index) => {
              const qty = Number(watchedItems?.[index]?.quantity || 0)
              const up = Number(watchedItems?.[index]?.unit_price || 0)
              const lineTotal = qty * up
              return (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <FormField label={index === 0 ? 'Descripción' : ''}>
                      <input {...register(`line_items.${index}.description`)} className={inputClass} placeholder="Descripción del servicio/producto" />
                    </FormField>
                  </div>
                  <div className="col-span-2">
                    <FormField label={index === 0 ? 'Cantidad' : ''}>
                      <input {...register(`line_items.${index}.quantity`)} type="number" step="0.01" className={inputClass} placeholder="1" />
                    </FormField>
                  </div>
                  <div className="col-span-2">
                    <FormField label={index === 0 ? 'Precio Unit.' : ''}>
                      <input {...register(`line_items.${index}.unit_price`)} type="number" step="0.01" className={inputClass} placeholder="0" />
                    </FormField>
                  </div>
                  <div className="col-span-2 text-right pb-2">
                    <p className={`text-sm font-medium ${index === 0 ? 'mt-5' : ''}`}>{formatCOP(lineTotal)}</p>
                  </div>
                  <div className="col-span-1 pb-2">
                    <button type="button" onClick={() => remove(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 min-w-64">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatCOP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA ({watchedTaxRate || 19}%)</span><span>{formatCOP(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
              <span>Total</span><span>{formatCOP(total)}</span>
            </div>
          </div>
        </div>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/accounting')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Crear Factura'}
          </button>
        </div>
      </form>
    </div>
  )
}
