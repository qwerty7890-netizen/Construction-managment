import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, Search } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import type { PaginatedResponse, Employee } from '../../types'

const statusColor: Record<string, 'green' | 'yellow' | 'blue' | 'red' | 'gray'> = {
  activo: 'green', vacaciones: 'blue', licencia: 'yellow', incapacidad: 'orange' as any, retirado: 'gray'
}

export default function PersonnelList() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery<PaginatedResponse<Employee>>({
    queryKey: ['employees', search],
    queryFn: async () => (await api.get('/personnel/employees/', { params: { search } })).data,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal</h1>
          <p className="text-gray-500 text-sm">{data?.count ?? 0} empleados registrados</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, código, cédula..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No se encontraron empleados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Código</th>
                    <th className="text-left px-6 py-3">Nombre</th>
                    <th className="text-left px-6 py-3">Cédula</th>
                    <th className="text-left px-6 py-3">Cargo</th>
                    <th className="text-left px-6 py-3">Departamento</th>
                    <th className="text-right px-6 py-3">Salario Base</th>
                    <th className="text-left px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.results.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-blue-600">{emp.employee_code}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{emp.full_name}</td>
                      <td className="px-6 py-4 font-mono text-gray-500">{emp.id_number}</td>
                      <td className="px-6 py-4 text-gray-600">{emp.position_name}</td>
                      <td className="px-6 py-4 text-gray-500">{emp.department_name}</td>
                      <td className="px-6 py-4 text-right font-medium">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(emp.base_salary))}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor[emp.status] || 'gray'}>{emp.status_display}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
