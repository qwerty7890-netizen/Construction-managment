import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Edit, Plus } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import FormField from '../../components/ui/FormField'
import type { Project } from '../../types'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray' | 'red'> = {
  en_ejecucion: 'green', adjudicado: 'blue', licitacion: 'yellow',
  suspendido: 'red', terminado: 'gray', liquidado: 'gray'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

interface Phase {
  id: number
  name: string
  description: string
  planned_start: string
  planned_end: string
  status: string
  status_display: string
}

const phaseSchema = z.object({
  name: z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  planned_start: z.string().optional(),
  planned_end: z.string().optional(),
  status: z.string().min(1, 'Requerido'),
})
type PhaseForm = z.infer<typeof phaseSchema>

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'info' | 'phases'>('info')
  const [showPhaseModal, setShowPhaseModal] = useState(false)

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => (await api.get(`/projects/projects/${id}/`)).data,
  })

  const { data: phases } = useQuery<Phase[]>({
    queryKey: ['phases', id],
    queryFn: async () => (await api.get('/projects/phases/', { params: { project: id } })).data,
    enabled: activeTab === 'phases',
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PhaseForm>({
    resolver: zodResolver(phaseSchema),
    defaultValues: { status: 'pendiente' },
  })

  const phaseMutation = useMutation({
    mutationFn: async (data: PhaseForm) => {
      return (await api.post('/projects/phases/', { ...data, project: Number(id) })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', id] })
      setShowPhaseModal(false)
      reset()
    },
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Cargando...</div>
  if (!project) return <div className="text-center py-20 text-gray-500">Proyecto no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <Badge variant={statusColor[project.status] || 'gray'}>{project.status_display}</Badge>
            </div>
            <p className="text-gray-500 text-sm font-mono">{project.code} · {project.municipality}, {project.department}</p>
          </div>
        </div>
        <Link
          to={`/projects/${id}/edit`}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg"
        >
          <Edit size={16} />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <p className="text-xs text-gray-500">Valor Contrato</p>
            <p className="text-lg font-bold text-gray-900">{formatCOP(project.contract_value)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-gray-500">Avance</p>
            <p className="text-lg font-bold text-gray-900">{project.advance_percentage}%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-gray-500">Inicio</p>
            <p className="text-base font-semibold text-gray-900">{project.start_date || '—'}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs text-gray-500">Fin</p>
            <p className="text-base font-semibold text-gray-900">{project.end_date || '—'}</p>
          </CardBody>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['info', 'phases'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'info' ? 'Información' : 'Fases'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'info' && (
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">Tipo:</span> <span className="font-medium ml-2">{project.project_type_display}</span></div>
            <div><span className="text-gray-500">Director:</span> <span className="font-medium ml-2">{project.director_name}</span></div>
            <div><span className="text-gray-500">Residente:</span> <span className="font-medium ml-2">{project.resident_name || '—'}</span></div>
            <div><span className="text-gray-500">Ubicación:</span> <span className="font-medium ml-2">{project.location || '—'}</span></div>
            {project.description && (
              <div className="md:col-span-2">
                <span className="text-gray-500">Descripción:</span>
                <p className="mt-1 text-gray-700">{project.description}</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'phases' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowPhaseModal(true)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg"
            >
              <Plus size={16} />
              Nueva Fase
            </button>
          </div>
          <Card>
            <CardBody className="p-0">
              {!phases?.length ? (
                <p className="text-center py-10 text-gray-400">No hay fases registradas</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Fase</th>
                      <th className="text-left px-6 py-3">Inicio Planificado</th>
                      <th className="text-left px-6 py-3">Fin Planificado</th>
                      <th className="text-left px-6 py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {phases.map((ph) => (
                      <tr key={ph.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{ph.name}</td>
                        <td className="px-6 py-4 text-gray-500">{ph.planned_start || '—'}</td>
                        <td className="px-6 py-4 text-gray-500">{ph.planned_end || '—'}</td>
                        <td className="px-6 py-4"><Badge variant="blue">{ph.status_display || ph.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      <Modal isOpen={showPhaseModal} onClose={() => setShowPhaseModal(false)} title="Nueva Fase" size="md">
        <form onSubmit={handleSubmit((d) => phaseMutation.mutate(d))} className="space-y-4">
          <FormField label="Nombre" required error={errors.name?.message}>
            <input {...register('name')} className={inputClass} placeholder="Nombre de la fase" />
          </FormField>
          <FormField label="Descripción" error={errors.description?.message}>
            <textarea {...register('description')} rows={2} className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Inicio Planificado" error={errors.planned_start?.message}>
              <input {...register('planned_start')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Fin Planificado" error={errors.planned_end?.message}>
              <input {...register('planned_end')} type="date" className={inputClass} />
            </FormField>
          </div>
          <FormField label="Estado" required error={errors.status?.message}>
            <select {...register('status')} className={inputClass}>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="suspendida">Suspendida</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowPhaseModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm">Cancelar</button>
            <button type="submit" disabled={phaseMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {phaseMutation.isPending ? 'Guardando...' : 'Guardar Fase'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
