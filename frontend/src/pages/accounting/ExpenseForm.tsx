import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'

const schema = z.object({
  description: z.string().min(1, 'Requerido'),
  amount: z.string().min(1, 'Requerido'),
  expense_date: z.string().min(1, 'Requerido'),
  category: z.string().min(1, 'Requerido'),
  project: z.string().optional(),
  notes: z.string().optional(),
  invoice_reference: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Project { id: number; name: string; code: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function ExpenseForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: projects } = useQuery<{ results: Project[] }>({
    queryKey: ['projects-select'],
    queryFn: async () => (await api.get('/projects/projects/')).data,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/accounting/expenses/', {
        ...data,
        project: data.project ? Number(data.project) : null,
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      navigate('/accounting')
    },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/accounting')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Gasto</h1>
          <p className="text-gray-500 text-sm">Registre un gasto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="Descripción" required error={errors.description?.message}>
                <input {...register('description')} className={inputClass} placeholder="Descripción del gasto" />
              </FormField>
            </div>
            <FormField label="Monto (COP)" required error={errors.amount?.message}>
              <input {...register('amount')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Fecha" required error={errors.expense_date?.message}>
              <input {...register('expense_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Categoría" required error={errors.category?.message}>
              <input {...register('category')} className={inputClass} placeholder="Materiales, Transporte, Nómina..." />
            </FormField>
            <FormField label="Proyecto (opcional)" error={errors.project?.message}>
              <select {...register('project')} className={inputClass}>
                <option value="">Ninguno</option>
                {projects?.results.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Referencia de Factura" error={errors.invoice_reference?.message}>
              <input {...register('invoice_reference')} className={inputClass} placeholder="FV-2025-001 (opcional)" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Notas" error={errors.notes?.message}>
                <textarea {...register('notes')} rows={2} className={inputClass} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm mt-2">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/accounting')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Registrar Gasto'}
          </button>
        </div>
      </form>
    </div>
  )
}
