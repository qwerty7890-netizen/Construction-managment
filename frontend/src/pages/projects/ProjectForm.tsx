import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  project_type: z.string().min(1, 'Requerido'),
  status: z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  location: z.string().optional(),
  municipality: z.string().optional(),
  department: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  contract_value: z.string().optional(),
  advance_percentage: z.string().optional(),
  director: z.string().min(1, 'Requerido'),
  resident: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface User { id: number; full_name: string; username: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'
const selectClass = inputClass

export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users/')).data,
  })

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => (await api.get(`/projects/projects/${id}/`)).data,
    enabled: isEdit,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'licitacion', project_type: 'vias' },
  })

  useEffect(() => {
    if (project) {
      reset({
        code: project.code,
        name: project.name,
        project_type: project.project_type,
        status: project.status,
        description: project.description || '',
        location: project.location || '',
        municipality: project.municipality || '',
        department: project.department || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        contract_value: project.contract_value || '',
        advance_percentage: project.advance_percentage || '',
        director: String(project.director),
        resident: project.resident ? String(project.resident) : '',
      })
    }
  }, [project, reset])

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        director: Number(data.director),
        resident: data.resident ? Number(data.resident) : null,
        contract_value: data.contract_value || '0',
        advance_percentage: data.advance_percentage || '0',
      }
      if (isEdit) {
        return (await api.patch(`/projects/projects/${id}/`, payload)).data
      }
      return (await api.post('/projects/projects/', payload)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/projects')
    },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/projects')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h1>
          <p className="text-gray-500 text-sm">Complete la información del proyecto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Código" required error={errors.code?.message}>
              <input {...register('code')} className={inputClass} placeholder="PRY-001" />
            </FormField>
            <FormField label="Nombre" required error={errors.name?.message}>
              <input {...register('name')} className={inputClass} placeholder="Nombre del proyecto" />
            </FormField>
            <FormField label="Tipo de Proyecto" required error={errors.project_type?.message}>
              <select {...register('project_type')} className={selectClass}>
                <option value="vias">Vías</option>
                <option value="movimiento_tierras">Movimiento de Tierras</option>
                <option value="infraestructura">Infraestructura</option>
                <option value="edificacion_residencial">Edificación Residencial</option>
                <option value="edificacion_comercial">Edificación Comercial</option>
                <option value="mixto">Mixto</option>
              </select>
            </FormField>
            <FormField label="Estado" required error={errors.status?.message}>
              <select {...register('status')} className={selectClass}>
                <option value="licitacion">Licitación</option>
                <option value="adjudicado">Adjudicado</option>
                <option value="en_ejecucion">En Ejecución</option>
                <option value="suspendido">Suspendido</option>
                <option value="terminado">Terminado</option>
                <option value="liquidado">Liquidado</option>
              </select>
            </FormField>
            <FormField label="Ubicación" error={errors.location?.message}>
              <input {...register('location')} className={inputClass} placeholder="Dirección / ubicación" />
            </FormField>
            <FormField label="Municipio" error={errors.municipality?.message}>
              <input {...register('municipality')} className={inputClass} placeholder="Municipio" />
            </FormField>
            <FormField label="Departamento" error={errors.department?.message}>
              <input {...register('department')} className={inputClass} placeholder="Departamento" />
            </FormField>
            <FormField label="Valor Contrato (COP)" error={errors.contract_value?.message}>
              <input {...register('contract_value')} type="number" step="1" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Avance (%)" error={errors.advance_percentage?.message}>
              <input {...register('advance_percentage')} type="number" min="0" max="100" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Fecha Inicio" error={errors.start_date?.message}>
              <input {...register('start_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Fecha Fin" error={errors.end_date?.message}>
              <input {...register('end_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Director" required error={errors.director?.message}>
              <select {...register('director')} className={selectClass}>
                <option value="">Seleccionar...</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Residente (opcional)" error={errors.resident?.message}>
              <select {...register('resident')} className={selectClass}>
                <option value="">Ninguno</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
                ))}
              </select>
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Descripción" error={errors.description?.message}>
                <textarea {...register('description')} rows={3} className={inputClass} placeholder="Descripción del proyecto..." />
              </FormField>
            </div>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/projects')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {mutation.isPending ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </div>
  )
}
