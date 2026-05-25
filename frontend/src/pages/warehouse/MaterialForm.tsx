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
  code: z.string().min(1, 'Requerido'),
  name: z.string().min(1, 'Requerido'),
  category: z.string().min(1, 'Requerido'),
  unit: z.string().min(1, 'Requerido'),
  unit_price: z.string().optional(),
  minimum_stock: z.string().optional(),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Category { id: number; name: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function MaterialForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/warehouse/categories/')).data,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/warehouse/materials/', {
        ...data,
        category: Number(data.category),
        unit_price: data.unit_price || '0',
        minimum_stock: data.minimum_stock || '0',
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
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Material</h1>
          <p className="text-gray-500 text-sm">Registre un nuevo material en el almacén</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Código" required error={errors.code?.message}>
              <input {...register('code')} className={inputClass} placeholder="MAT-001" />
            </FormField>
            <FormField label="Nombre" required error={errors.name?.message}>
              <input {...register('name')} className={inputClass} placeholder="Nombre del material" />
            </FormField>
            <FormField label="Categoría" required error={errors.category?.message}>
              <select {...register('category')} className={inputClass}>
                <option value="">Seleccionar...</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Unidad" required error={errors.unit?.message}>
              <input {...register('unit')} className={inputClass} placeholder="m³, kg, und, m..." />
            </FormField>
            <FormField label="Precio Unitario (COP)" error={errors.unit_price?.message}>
              <input {...register('unit_price')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Stock Mínimo" error={errors.minimum_stock?.message}>
              <input {...register('minimum_stock')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Descripción" error={errors.description?.message}>
                <textarea {...register('description')} rows={2} className={inputClass} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/warehouse')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Registrar Material'}
          </button>
        </div>
      </form>
    </div>
  )
}
