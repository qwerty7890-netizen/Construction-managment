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
  equipment_type: z.string().min(1, 'Requerido'),
  brand: z.string().optional(),
  model: z.string().optional(),
  plate: z.string().optional(),
  status: z.string().min(1, 'Requerido'),
  ownership: z.string().min(1, 'Requerido'),
  fuel_type: z.string().min(1, 'Requerido'),
  current_hourmeter: z.string().optional(),
  year: z.string().optional(),
  insurance_expiry: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function EquipmentForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: equipment } = useQuery({
    queryKey: ['equipment-item', id],
    queryFn: async () => (await api.get(`/equipment/equipment/${id}/`)).data,
    enabled: isEdit,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'disponible', ownership: 'propio', fuel_type: 'diesel', equipment_type: 'excavadora' },
  })

  useEffect(() => {
    if (equipment) {
      reset({
        code: equipment.code,
        name: equipment.name,
        equipment_type: equipment.equipment_type,
        brand: equipment.brand || '',
        model: equipment.model || '',
        plate: equipment.plate || '',
        status: equipment.status,
        ownership: equipment.ownership,
        fuel_type: equipment.fuel_type,
        current_hourmeter: equipment.current_hourmeter || '',
        year: equipment.year ? String(equipment.year) : '',
        insurance_expiry: equipment.insurance_expiry || '',
      })
    }
  }, [equipment, reset])

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        current_hourmeter: data.current_hourmeter || '0',
        year: data.year ? Number(data.year) : null,
        insurance_expiry: data.insurance_expiry || null,
      }
      if (isEdit) return (await api.patch(`/equipment/equipment/${id}/`, payload)).data
      return (await api.post('/equipment/equipment/', payload)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      navigate('/equipment')
    },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/equipment')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Equipo' : 'Nuevo Equipo'}</h1>
          <p className="text-gray-500 text-sm">Registre la información del equipo o maquinaria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Código" required error={errors.code?.message}>
              <input {...register('code')} className={inputClass} placeholder="EQ-001" readOnly={isEdit} disabled={isEdit} />
            </FormField>
            <FormField label="Nombre" required error={errors.name?.message}>
              <input {...register('name')} className={inputClass} placeholder="Nombre del equipo" />
            </FormField>
            <FormField label="Tipo de Equipo" required error={errors.equipment_type?.message}>
              <select {...register('equipment_type')} className={inputClass}>
                <option value="excavadora">Excavadora</option>
                <option value="bulldozer">Bulldozer</option>
                <option value="motoniveladora">Motoniveladora</option>
                <option value="vibro_compactador">Vibro Compactador</option>
                <option value="volqueta">Volqueta</option>
                <option value="mixer">Mixer</option>
                <option value="grua">Grúa</option>
                <option value="retroexcavadora">Retroexcavadora</option>
                <option value="mini_cargador">Mini Cargador</option>
                <option value="compactador">Compactador</option>
                <option value="otro">Otro</option>
              </select>
            </FormField>
            <FormField label="Estado" required error={errors.status?.message}>
              <select {...register('status')} className={inputClass}>
                <option value="disponible">Disponible</option>
                <option value="asignado">Asignado</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="danado">Dañado</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </FormField>
            <FormField label="Propiedad" required error={errors.ownership?.message}>
              <select {...register('ownership')} className={inputClass}>
                <option value="propio">Propio</option>
                <option value="arrendado">Arrendado</option>
                <option value="leasing">Leasing</option>
              </select>
            </FormField>
            <FormField label="Tipo de Combustible" required error={errors.fuel_type?.message}>
              <select {...register('fuel_type')} className={inputClass}>
                <option value="diesel">Diesel</option>
                <option value="gasolina">Gasolina</option>
                <option value="electrico">Eléctrico</option>
              </select>
            </FormField>
            <FormField label="Marca" error={errors.brand?.message}>
              <input {...register('brand')} className={inputClass} placeholder="Caterpillar, Komatsu..." />
            </FormField>
            <FormField label="Modelo" error={errors.model?.message}>
              <input {...register('model')} className={inputClass} placeholder="Modelo" />
            </FormField>
            <FormField label="Placa" error={errors.plate?.message}>
              <input {...register('plate')} className={inputClass} placeholder="ABC-123" />
            </FormField>
            <FormField label="Horómetro Actual (h)" error={errors.current_hourmeter?.message}>
              <input {...register('current_hourmeter')} type="number" step="0.1" className={inputClass} placeholder="0" />
            </FormField>
            <FormField label="Año" error={errors.year?.message}>
              <input {...register('year')} type="number" min="1980" max="2030" className={inputClass} placeholder="2020" />
            </FormField>
            <FormField label="Vencimiento Seguro" error={errors.insurance_expiry?.message}>
              <input {...register('insurance_expiry')} type="date" className={inputClass} />
            </FormField>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/equipment')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {mutation.isPending ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Equipo'}
          </button>
        </div>
      </form>
    </div>
  )
}
