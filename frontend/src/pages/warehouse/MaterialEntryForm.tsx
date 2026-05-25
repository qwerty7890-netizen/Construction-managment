import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'
import type { Material } from '../../types'

const schema = z.object({
  material: z.string().min(1, 'Requerido'),
  quantity: z.string().min(1, 'Requerido'),
  unit_price: z.string().optional(),
  date: z.string().min(1, 'Requerido'),
  supplier: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Supplier { id: number; name: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function MaterialEntryForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: materials } = useQuery<{ results: Material[] }>({
    queryKey: ['materials'],
    queryFn: async () => (await api.get('/warehouse/materials/')).data,
  })

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: async () => (await api.get('/warehouse/suppliers/')).data,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/warehouse/entries/', {
        ...data,
        material: Number(data.material),
        quantity: data.quantity,
        unit_price: data.unit_price || '0',
        supplier: data.supplier ? Number(data.supplier) : null,
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      navigate('/warehouse')
    },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/warehouse')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entrada de Material</h1>
          <p className="text-gray-500 text-sm">Registre una entrada de materiales al almacén</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Material" required error={errors.material?.message}>
              <select {...register('material')} className={inputClass}>
                <option value="">Seleccionar material...</option>
                {materials?.results.map((m) => (
                  <option key={m.id} value={m.id}>{m.code} — {m.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Cantidad" required error={errors.quantity?.message}>
              <input {...register('quantity')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Precio Unitario (COP)" error={errors.unit_price?.message}>
              <input {...register('unit_price')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Fecha" required error={errors.date?.message}>
              <input {...register('date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Proveedor (opcional)" error={errors.supplier?.message}>
              <select {...register('supplier')} className={inputClass}>
                <option value="">Ninguno</option>
                {suppliers?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Notas" error={errors.notes?.message}>
              <input {...register('notes')} className={inputClass} placeholder="Observaciones..." />
            </FormField>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm mt-2">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/warehouse')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Registrar Entrada'}
          </button>
        </div>
      </form>
    </div>
  )
}
