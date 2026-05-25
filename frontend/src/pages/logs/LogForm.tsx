import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'

const activitySchema = z.object({
  activity_type: z.string().min(1),
  description: z.string().min(1),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
})

const logSchema = z.object({
  project: z.string().min(1, 'Requerido'),
  date: z.string().min(1, 'Requerido'),
  weather: z.string().optional(),
  temperature: z.string().optional(),
  general_notes: z.string().optional(),
  activities: z.array(activitySchema).optional(),
})

type LogFormValues = z.infer<typeof logSchema>

interface ProjectOption { id: number; name: string; code: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function LogForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // savedLogId reserved for future use (e.g., redirecting to log detail)
  const [_savedLogId, setSavedLogId] = useState<number | null>(null)

  const { data: projects } = useQuery<{ results: ProjectOption[] }>({
    queryKey: ['projects-select'],
    queryFn: async () => (await api.get('/projects/projects/')).data,
  })

  const { register, handleSubmit, control, formState: { errors } } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { weather: 'soleado', activities: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'activities' })

  const logMutation = useMutation({
    mutationFn: async (data: LogFormValues) => {
      const logPayload = {
        project: Number(data.project),
        date: data.date,
        weather_morning: data.weather || 'soleado',
        weather_afternoon: data.weather || 'soleado',
        temperature: data.temperature ? Number(data.temperature) : null,
        general_notes: data.general_notes || '',
      }
      const log = (await api.post('/logs/daily-logs/', logPayload)).data

      if (data.activities && data.activities.length > 0) {
        await Promise.all(data.activities.map((act) =>
          api.post('/logs/activities/', {
            log: log.id,
            activity_type: act.activity_type,
            description: act.description,
            quantity: act.quantity || null,
            unit: act.unit || '',
            start_time: act.start_time || null,
            end_time: act.end_time || null,
          })
        ))
      }
      return log
    },
    onSuccess: (log) => {
      queryClient.invalidateQueries({ queryKey: ['daily-logs'] })
      setSavedLogId(log.id)
      navigate('/logs')
    },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/logs')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Registro de Bitácora</h1>
          <p className="text-gray-500 text-sm">Registre las actividades del día</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => logMutation.mutate(d))} className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-semibold text-gray-900">Información General</h2></CardHeader>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <FormField label="Clima" error={errors.weather?.message}>
              <select {...register('weather')} className={inputClass}>
                <option value="soleado">Soleado</option>
                <option value="nublado">Nublado</option>
                <option value="lluvioso">Lluvioso</option>
                <option value="parcialmente_nublado">Parcialmente Nublado</option>
              </select>
            </FormField>
            <FormField label="Temperatura (°C)" error={errors.temperature?.message}>
              <input {...register('temperature')} type="number" step="0.1" className={inputClass} placeholder="25" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Notas Generales" error={errors.general_notes?.message}>
                <textarea {...register('general_notes')} rows={3} className={inputClass} placeholder="Observaciones generales del día..." />
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Actividades</h2>
            <button
              type="button"
              onClick={() => append({ activity_type: 'excavacion', description: '', quantity: '', unit: '', start_time: '', end_time: '' })}
              className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              <Plus size={16} />Agregar Actividad
            </button>
          </CardHeader>
          <CardBody className="space-y-4">
            {fields.length === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">No hay actividades. Haga clic en "+ Agregar Actividad"</p>
            )}
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Actividad {index + 1}</span>
                  <button type="button" onClick={() => remove(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Tipo">
                    <select {...register(`activities.${index}.activity_type`)} className={inputClass}>
                      <option value="excavacion">Excavación</option>
                      <option value="relleno">Relleno</option>
                      <option value="pavimentacion">Pavimentación</option>
                      <option value="concreto">Concreto</option>
                      <option value="instalacion">Instalación</option>
                      <option value="transporte">Transporte</option>
                      <option value="topografia">Topografía</option>
                      <option value="otro">Otro</option>
                    </select>
                  </FormField>
                  <FormField label="Descripción">
                    <input {...register(`activities.${index}.description`)} className={inputClass} placeholder="Descripción de la actividad" />
                  </FormField>
                  <FormField label="Cantidad">
                    <input {...register(`activities.${index}.quantity`)} type="number" step="0.01" className={inputClass} placeholder="0" />
                  </FormField>
                  <FormField label="Unidad">
                    <input {...register(`activities.${index}.unit`)} className={inputClass} placeholder="m³, m², ton..." />
                  </FormField>
                  <FormField label="Hora Inicio">
                    <input {...register(`activities.${index}.start_time`)} type="time" className={inputClass} />
                  </FormField>
                  <FormField label="Hora Fin">
                    <input {...register(`activities.${index}.end_time`)} type="time" className={inputClass} />
                  </FormField>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {logMutation.error && (
          <p className="text-red-500 text-sm">{String((logMutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/logs')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={logMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {logMutation.isPending ? 'Guardando...' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  )
}
