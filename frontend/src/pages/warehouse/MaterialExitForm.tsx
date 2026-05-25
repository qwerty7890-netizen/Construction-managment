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
  project: z.string().min(1, 'Requerido'),
  date: z.string().min(1, 'Requerido'),
  purpose: z.string().min(1, 'Requerido'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Project { id: number; name: string; code: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function MaterialExitForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: materials } = useQuery<{ results: Material[] }>({
    queryKey: ['materials'],
    queryFn: async () => (await api.get('/warehouse/materials/')).data,
  })

  const { data: projects } = useQuery<{ results: Project[] }>({
    queryKey: ['projects-select'],
    queryFn: async () => (await api.get('/projects/projects/')).data,
  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const selectedMaterial = watch('material')
  const selectedQty = watch('quantity')
  const currentMaterial = materials?.results.find((m) => m.id === Number(selectedMaterial))

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (currentMaterial && Number(data.quantity) > Number(currentMaterial.current_stock)) {
        throw new Error(`Cantidad excede el stock disponible (${currentMaterial.current_stock} ${currentMaterial.unit})`)
      }
      return (await api.post('/warehouse/exits/', {
        ...data,
        material: Number(data.material),
        project: Number(data.project),
        quantity: data.quantity,
      })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      navigate('/warehouse')
    },
  })

  const stockWarning = currentMaterial && selectedQty && Number(selectedQty) > Number(currentMaterial.current_stock)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/warehouse')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salida de Material</h1>
          <p className="text-gray-500 text-sm">Registre una salida de materiales del almacén</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Material" required error={errors.material?.message}>
              <select {...register('material')} className={inputClass}>
                <option value="">Seleccionar material...</option>
                {materials?.results.map((m) => (
                  <option key={m.id} value={m.id}>{m.code} — {m.name} (Stock: {Number(m.current_stock).toLocaleString('es-CO')} {m.unit})</option>
                ))}
              </select>
            </FormField>
            <div>
              <FormField label="Cantidad" required error={errors.quantity?.message}>
                <input {...register('quantity')} type="number" step="0.01" className={inputClass} placeholder="0" />
              </FormField>
              {stockWarning && (
                <p className="text-xs text-red-500 mt-1">
                  Excede el stock disponible ({Number(currentMaterial.current_stock).toLocaleString('es-CO')} {currentMaterial.unit})
                </p>
              )}
            </div>
            <FormField label="Proyecto" required error={errors.project?.message}>
              <select {...register('project')} className={inputClass}>
                <option value="">Seleccionar proyecto...</option>
                {projects?.results.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Fecha" required error={errors.date?.message}>
              <input {...register('date')} type="date" className={inputClass} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Propósito / Uso" required error={errors.purpose?.message}>
                <input {...register('purpose')} className={inputClass} placeholder="Para qué se usará el material..." />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Notas" error={errors.notes?.message}>
                <textarea {...register('notes')} rows={2} className={inputClass} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm mt-2">{String((mutation.error as any)?.message || (mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/warehouse')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Registrar Salida'}
          </button>
        </div>
      </form>
    </div>
  )
}
