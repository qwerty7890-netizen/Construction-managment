import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray' | 'red' | 'orange'> = {
  activo: 'green', vacaciones: 'blue', incapacidad: 'orange', retirado: 'gray'
}

function formatCOP(v: string | number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

interface EmployeeDetail {
  id: number
  employee_code: string
  full_name: string
  first_name: string
  last_name: string
  id_type: string
  id_type_display: string
  id_number: string
  department: number
  department_name: string
  position: number
  position_name: string
  status: string
  status_display: string
  base_salary: string
  phone: string
  email: string
  hire_date: string
  address: string
  blood_type: string
  emergency_contact: string
  emergency_phone: string
}

export default function PersonnelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: employee, isLoading } = useQuery<EmployeeDetail>({
    queryKey: ['employee', id],
    queryFn: async () => (await api.get(`/personnel/employees/${id}/`)).data,
  })

  if (isLoading) return <div className="text-center py-20 text-gray-400">Cargando...</div>
  if (!employee) return <div className="text-center py-20 text-gray-500">Empleado no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/personnel')} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
              <Badge variant={statusColor[employee.status] || 'gray'}>{employee.status_display}</Badge>
            </div>
            <p className="text-gray-500 text-sm font-mono">{employee.employee_code} · {employee.position_name} · {employee.department_name}</p>
          </div>
        </div>
        <Link
          to={`/personnel/${id}/edit`}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg"
        >
          <Edit size={16} />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Información Personal</h2>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo Documento</span>
              <span className="font-medium">{employee.id_type_display || employee.id_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Número Documento</span>
              <span className="font-medium font-mono">{employee.id_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Teléfono</span>
              <span className="font-medium">{employee.phone || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{employee.email || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dirección</span>
              <span className="font-medium text-right max-w-xs">{employee.address || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo de Sangre</span>
              <span className="font-medium">{employee.blood_type || '—'}</span>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-gray-500 text-xs mb-2">Contacto de Emergencia</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Nombre</span>
                <span className="font-medium">{employee.emergency_contact || '—'}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Teléfono</span>
                <span className="font-medium">{employee.emergency_phone || '—'}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Información Laboral</h2>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Código</span>
              <span className="font-medium font-mono">{employee.employee_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Departamento</span>
              <span className="font-medium">{employee.department_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cargo</span>
              <span className="font-medium">{employee.position_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fecha de Ingreso</span>
              <span className="font-medium">{employee.hire_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Salario Base</span>
              <span className="font-bold text-gray-900">{formatCOP(employee.base_salary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado</span>
              <Badge variant={statusColor[employee.status] || 'gray'}>{employee.status_display}</Badge>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
