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
import type { Equipment } from '../../types'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray' | 'red' | 'orange'> = {
  disponible: 'green', asignado: 'blue', mantenimiento: 'yellow', danado: 'red', inactivo: 'gray'
}

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

const maintenanceSchema = z.object({
  maintenance_type: z.string().min(1, 'Requerido'),
  description: z.string().min(1, 'Requerido'),
  date: z.string().min(1, 'Requerido'),
  cost: z.string().optional(),
  hours_at_maintenance: z.string().optional(),
  next_maintenance_hours: z.string().optional(),
})
type MaintenanceForm = z.infer<typeof maintenanceSchema>

const fuelSchema = z.object({
  date: z.string().min(1, 'Requerido'),
  gallons: z.string().min(1, 'Requerido'),
  unit_cost: z.string().optional(),
  total_cost: z.string().optional(),
  hourmeter: z.string().optional(),
  project: z.string().optional(),
})
type FuelForm = z.infer<typeof fuelSchema>

interface Project { id: number; name: string; code: string }
interface Maintenance { id: number; maintenance_type: string; maintenance_type_display: string; description: string; date: string; cost: string; hours_at_maintenance: string }
interface FuelLog { id: number; date: string; gallons: string; unit_cost: string; total_cost: string; hourmeter: string | null; project_name: string | null }

export default function EquipmentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'maintenance' | 'fuel'>('maintenance')
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showFuelModal, setShowFuelModal] = useState(false)

  const { data: equipment, isLoading } = useQuery<Equipment>({
    queryKey: ['equipment-item', id],
    queryFn: async () => (await api.get(`/equipment/equipment/${id}/`)).data,
  })

  const { data: maintenances } = useQuery<Maintenance[]>({
    queryKey: ['maintenances', id],
    queryFn: async () => (await api.get('/equipment/maintenance/', { params: { equipment: id } })).data,
    enabled: activeTab === 'maintenance',
  })

  const { data: fuelLogs } = useQuery<FuelLog[]>({
    queryKey: ['fuel-logs', id],
    queryFn: async () => (await api.get('/equipment/fuel/', { params: { equipment: id } })).data,
    enabled: activeTab === 'fuel',
  })

  const { data: projects } = useQuery<{ results: Project[] }>({
    queryKey: ['projects-select'],
    queryFn: async () => (await api.get('/projects/projects/')).data,
  })

  const mForm = useForm<MaintenanceForm>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { maintenance_type: 'preventivo' },
  })

  const fForm = useForm<FuelForm>({
    resolver: zodResolver(fuelSchema),
  })

  const maintenanceMutation = useMutation({
    mutationFn: async (data: MaintenanceForm) => {
      return (await api.post('/equipment/maintenance/', { ...data, equipment: Number(id) })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances', id] })
      setShowMaintenanceModal(false)
      mForm.reset()
    },
  })

  const fuelMutation = useMutation({
    mutationFn: async (data: FuelForm) => {
      const payload = { ...data, equipment: Number(id), project: data.project ? Number(data.project) : null }
      return (await api.post('/equipment/fuel/', payload)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-logs', id] })
      setShowFuelModal(false)
      fForm.reset()
    },
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Cargando...</div>
  if (!equipment) return <div className="text-center py-20 text-gray-500">Equipo no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/equipment')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{equipment.name}</h1>
              <Badge variant={statusColor[equipment.status] || 'gray'}>{equipment.status_display}</Badge>
            </div>
            <p className="text-gray-500 text-sm font-mono">{equipment.code} · {equipment.equipment_type_display} · {equipment.ownership}</p>
          </div>
        </div>
        <Link
          to={`/equipment/${id}/edit`}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg"
        >
          <Edit size={16} />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardBody><p className="text-xs text-gray-500">Marca/Modelo</p><p className="font-semibold">{equipment.brand} {equipment.model || '—'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs text-gray-500">Placa</p><p className="font-semibold font-mono">{equipment.plate || '—'}</p></CardBody></Card>
        <Card><CardBody><p className="text-xs text-gray-500">Horómetro</p><p className="font-semibold">{Number(equipment.current_hourmeter).toLocaleString('es-CO')} h</p></CardBody></Card>
        <Card><CardBody><p className="text-xs text-gray-500">Combustible</p><p className="font-semibold capitalize">{equipment.fuel_type}</p></CardBody></Card>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['maintenance', 'fuel'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'maintenance' ? 'Mantenimientos' : 'Combustible'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowMaintenanceModal(true)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={16} />Registrar Mantenimiento
            </button>
          </div>
          <Card>
            <CardBody className="p-0">
              {!maintenances?.length ? (
                <p className="text-center py-10 text-gray-400">No hay mantenimientos registrados</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Tipo</th>
                      <th className="text-left px-6 py-3">Descripción</th>
                      <th className="text-left px-6 py-3">Fecha</th>
                      <th className="text-right px-6 py-3">Costo</th>
                      <th className="text-right px-6 py-3">Horas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {maintenances.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4"><Badge variant="blue">{m.maintenance_type_display || m.maintenance_type}</Badge></td>
                        <td className="px-6 py-4 text-gray-700">{m.description}</td>
                        <td className="px-6 py-4 text-gray-500">{m.date}</td>
                        <td className="px-6 py-4 text-right">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(m.cost))}</td>
                        <td className="px-6 py-4 text-right">{m.hours_at_maintenance} h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowFuelModal(true)} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={16} />Registrar Combustible
            </button>
          </div>
          <Card>
            <CardBody className="p-0">
              {!fuelLogs?.length ? (
                <p className="text-center py-10 text-gray-400">No hay registros de combustible</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Fecha</th>
                      <th className="text-right px-6 py-3">Galones</th>
                      <th className="text-right px-6 py-3">Costo/Gal</th>
                      <th className="text-right px-6 py-3">Horómetro</th>
                      <th className="text-left px-6 py-3">Proyecto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fuelLogs.map((f) => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-700">{f.date}</td>
                        <td className="px-6 py-4 text-right">{Number(f.gallons).toLocaleString('es-CO', { maximumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 text-right">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(f.unit_cost))}</td>
                        <td className="px-6 py-4 text-right">{f.hourmeter ? `${f.hourmeter} h` : '—'}</td>
                        <td className="px-6 py-4 text-gray-500">{f.project_name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Maintenance Modal */}
      <Modal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} title="Registrar Mantenimiento" size="md">
        <form onSubmit={mForm.handleSubmit((d) => maintenanceMutation.mutate(d))} className="space-y-4">
          <FormField label="Tipo de Mantenimiento" required error={mForm.formState.errors.maintenance_type?.message}>
            <select {...mForm.register('maintenance_type')} className={inputClass}>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="predictivo">Predictivo</option>
            </select>
          </FormField>
          <FormField label="Descripción" required error={mForm.formState.errors.description?.message}>
            <textarea {...mForm.register('description')} rows={2} className={inputClass} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Fecha" required error={mForm.formState.errors.date?.message}>
              <input {...mForm.register('date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Costo (COP)" error={mForm.formState.errors.cost?.message}>
              <input {...mForm.register('cost')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Horas al momento" error={mForm.formState.errors.hours_at_maintenance?.message}>
              <input {...mForm.register('hours_at_maintenance')} type="number" step="0.1" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Próximo mantenimiento (h)" error={mForm.formState.errors.next_maintenance_hours?.message}>
              <input {...mForm.register('next_maintenance_hours')} type="number" step="0.1" className={inputClass} placeholder="0" />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm">Cancelar</button>
            <button type="submit" disabled={maintenanceMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {maintenanceMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Fuel Modal */}
      <Modal isOpen={showFuelModal} onClose={() => setShowFuelModal(false)} title="Registrar Combustible" size="md">
        <form onSubmit={fForm.handleSubmit((d) => fuelMutation.mutate(d))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Fecha" required error={fForm.formState.errors.date?.message}>
              <input {...fForm.register('date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Galones" required error={fForm.formState.errors.gallons?.message}>
              <input {...fForm.register('gallons')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Costo por Galón (COP)" error={fForm.formState.errors.unit_cost?.message}>
              <input {...fForm.register('unit_cost')} type="number" step="0.01" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Horómetro actual (h)" error={fForm.formState.errors.hourmeter?.message}>
              <input {...fForm.register('hourmeter')} type="number" step="0.1" className={inputClass} placeholder="0" />
            </FormField>
          </div>
          <FormField label="Proyecto (opcional)" error={fForm.formState.errors.project?.message}>
            <select {...fForm.register('project')} className={inputClass}>
              <option value="">Ninguno</option>
              {projects?.results.map((p) => (
                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowFuelModal(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm">Cancelar</button>
            <button type="submit" disabled={fuelMutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
              {fuelMutation.isPending ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
