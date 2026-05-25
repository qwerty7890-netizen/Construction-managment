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
  employee_code: z.string().min(1, 'Requerido'),
  first_name: z.string().min(1, 'Requerido'),
  last_name: z.string().min(1, 'Requerido'),
  id_type: z.string().min(1, 'Requerido'),
  id_number: z.string().min(1, 'Requerido'),
  department: z.string().min(1, 'Requerido'),
  position: z.string().min(1, 'Requerido'),
  status: z.string().min(1, 'Requerido'),
  base_salary: z.string().min(1, 'Requerido'),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  hire_date: z.string().min(1, 'Requerido'),
  address: z.string().optional(),
  blood_type: z.string().optional(),
  emergency_contact: z.string().optional(),
  emergency_phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Department { id: number; name: string }
interface Position { id: number; name: string }

const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full'

export default function PersonnelForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: departments } = useQuery<{ results: Department[] }>({
    queryKey: ['departments'],
    queryFn: async () => (await api.get('/personnel/departments/')).data,
  })

  const { data: positions } = useQuery<{ results: Position[] }>({
    queryKey: ['positions'],
    queryFn: async () => (await api.get('/personnel/positions/')).data,
  })

  const { data: employee } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => (await api.get(`/personnel/employees/${id}/`)).data,
    enabled: isEdit,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'activo', id_type: 'CC' },
  })

  useEffect(() => {
    if (employee) {
      reset({
        employee_code: employee.employee_code,
        first_name: employee.first_name,
        last_name: employee.last_name,
        id_type: employee.id_type,
        id_number: employee.id_number,
        department: String(employee.department),
        position: String(employee.position),
        status: employee.status,
        base_salary: employee.base_salary,
        phone: employee.phone || '',
        email: employee.email || '',
        hire_date: employee.hire_date,
        address: employee.address || '',
        blood_type: employee.blood_type || '',
        emergency_contact: employee.emergency_contact || '',
        emergency_phone: employee.emergency_phone || '',
      })
    }
  }, [employee, reset])

  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        department: Number(data.department),
        position: Number(data.position),
        email: data.email || null,
      }
      if (isEdit) return (await api.patch(`/personnel/employees/${id}/`, payload)).data
      return (await api.post('/personnel/employees/', payload)).data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/personnel')
    },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/personnel')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}</h1>
          <p className="text-gray-500 text-sm">Complete la información del empleado</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Código Empleado" required error={errors.employee_code?.message}>
              <input {...register('employee_code')} className={inputClass} placeholder="EMP-001" />
            </FormField>
            <FormField label="Estado" required error={errors.status?.message}>
              <select {...register('status')} className={inputClass}>
                <option value="activo">Activo</option>
                <option value="vacaciones">Vacaciones</option>
                <option value="incapacidad">Incapacidad</option>
                <option value="retirado">Retirado</option>
              </select>
            </FormField>
            <FormField label="Primer Nombre" required error={errors.first_name?.message}>
              <input {...register('first_name')} className={inputClass} />
            </FormField>
            <FormField label="Apellido" required error={errors.last_name?.message}>
              <input {...register('last_name')} className={inputClass} />
            </FormField>
            <FormField label="Tipo de Documento" required error={errors.id_type?.message}>
              <select {...register('id_type')} className={inputClass}>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
            </FormField>
            <FormField label="Número de Documento" required error={errors.id_number?.message}>
              <input {...register('id_number')} className={inputClass} />
            </FormField>
            <FormField label="Departamento" required error={errors.department?.message}>
              <select {...register('department')} className={inputClass}>
                <option value="">Seleccionar...</option>
                {(departments?.results || []).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Cargo" required error={errors.position?.message}>
              <select {...register('position')} className={inputClass}>
                <option value="">Seleccionar...</option>
                {(positions?.results || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Salario Base (COP)" required error={errors.base_salary?.message}>
              <input {...register('base_salary')} type="number" step="1" className={inputClass} />
            </FormField>
            <FormField label="Fecha de Ingreso" required error={errors.hire_date?.message}>
              <input {...register('hire_date')} type="date" className={inputClass} />
            </FormField>
            <FormField label="Teléfono" error={errors.phone?.message}>
              <input {...register('phone')} className={inputClass} placeholder="3001234567" />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <input {...register('email')} type="email" className={inputClass} />
            </FormField>
            <FormField label="Tipo de Sangre" error={errors.blood_type?.message}>
              <select {...register('blood_type')} className={inputClass}>
                <option value="">Seleccionar...</option>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Dirección" error={errors.address?.message}>
                <input {...register('address')} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Contacto de Emergencia" error={errors.emergency_contact?.message}>
              <input {...register('emergency_contact')} className={inputClass} />
            </FormField>
            <FormField label="Teléfono de Emergencia" error={errors.emergency_phone?.message}>
              <input {...register('emergency_phone')} className={inputClass} />
            </FormField>
          </CardBody>
        </Card>

        {mutation.error && (
          <p className="text-red-500 text-sm">{String((mutation.error as any)?.response?.data?.detail || 'Error al guardar')}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/personnel')} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={mutation.isPending} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Registrar Empleado'}
          </button>
        </div>
      </form>
    </div>
  )
}
