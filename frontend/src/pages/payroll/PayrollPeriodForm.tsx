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
  period_type: z.string().min(1, 'Requerido'),
  start_date: z.string().min(1, 'Requerido'),
  end_date: z.string().min(1, 'Requerido'),
})

type FormValues = z.infer<typeof schema>

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function PayrollPeriodForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { period_type: 'quincenal' },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return (await api.post('/payroll/periods/', data)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
      navigate('/payroll')
    },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/payroll')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Período de Nómina</h1>
          <p className="text-gray-500 text-sm">Cree un nuevo período de nómina</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="Nombre del Período" required error={errors.name?.message}>
                <input {...register('name')} className={inputClass} placeholder="Ej: Quincena 1 - Enero 2025" />
              </FormField>
            </div>
            <FormField label="Tipo de Período" required error={errors.period_type?.message}>
              <select {...register('period_type')} className={inputClass}>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </FormField>
            <div />
            <FormField label="Fecha Inicio" required error={errors.start_date?.message}>
              <input {...register('start_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Fecha Fin" required error={errors.end_date?.message}>
              <input {...register('end_date')} type="date" className={inputClass} />
            </FormField>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end mt-4">
          <button type="button" onClick={() => navigate('/payroll')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : 'Crear Período'}
          </button>
        </div>
      </form>
    </div>
  )
}
