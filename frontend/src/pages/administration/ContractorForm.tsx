import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'

const schema = z.object({
  name: z.string().min(1, 'Requerido'),
  nit: z.string().min(1, 'Requerido'),
  specialty: z.string().optional(),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function ContractorForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/admin/contractors/', { ...data, email: data.email || null })).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractors'] })
      navigate('/administration')
    },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/administration')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Contratista</h1>
          <p className="text-gray-500 text-sm">Registre un nuevo contratista</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="Nombre / Razón Social" required error={errors.name?.message}>
                <input {...register('name')} className={inputClass} placeholder="Nombre del contratista" />
              </FormField>
            </div>
            <FormField label="NIT / Documento" required error={errors.nit?.message}>
              <input {...register('nit')} className={inputClass} placeholder="900.123.456-7" />
            </FormField>
            <FormField label="Especialidad" error={errors.specialty?.message}>
              <input {...register('specialty')} className={inputClass} placeholder="Movimiento de tierras, Concreto..." />
            </FormField>
            <FormField label="Persona de Contacto" error={errors.contact_person?.message}>
              <input {...register('contact_person')} className={inputClass} />
            </FormField>
            <FormField label="Teléfono" error={errors.phone?.message}>
              <input {...register('phone')} className={inputClass} />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <input {...register('email')} type="email" className={inputClass} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Dirección" error={errors.address?.message}>
                <input {...register('address')} className={inputClass} />
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
          <p className="text-red-500 text-sm mt-2">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/administration')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Registrar Contratista'}
          </button>
        </div>
      </form>
    </div>
  )
}
