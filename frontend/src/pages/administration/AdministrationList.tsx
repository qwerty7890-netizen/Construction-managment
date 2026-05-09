import { useQuery } from '@tanstack/react-query'
import { Building2, Users, FileText } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import type { PaginatedResponse } from '../../types'

interface Client { id: number; name: string; client_type_display: string; nit: string; city: string; is_active: boolean }
interface Contractor { id: number; name: string; specialty_display: string; nit: string; city: string; is_active: boolean }

export default function AdministrationList() {
  const { data: clients } = useQuery<PaginatedResponse<Client>>({
    queryKey: ['clients'],
    queryFn: async () => (await api.get('/admin/clients/')).data,
  })
  const { data: contractors } = useQuery<PaginatedResponse<Contractor>>({
    queryKey: ['contractors'],
    queryFn: async () => (await api.get('/admin/contractors/')).data,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
        <p className="text-gray-500 text-sm">Clientes, contratistas y contratos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Clientes" value={clients?.count ?? 0} icon={Building2} color="bg-blue-500" />
        <StatCard title="Contratistas" value={contractors?.count ?? 0} icon={Users} color="bg-purple-500" />
        <StatCard title="Contratos Activos" value="—" icon={FileText} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 size={18} className="text-blue-500" />
              Clientes
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Tipo</th>
                  <th className="text-left px-4 py-3">NIT</th>
                  <th className="text-left px-4 py-3">Ciudad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients?.results.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.client_type_display}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{c.nit}</td>
                    <td className="px-4 py-3 text-gray-500">{c.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              Contratistas
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Especialidad</th>
                  <th className="text-left px-4 py-3">NIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contractors?.results.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.specialty_display}</td>
                    <td className="px-4 py-3 font-mono text-gray-500">{c.nit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
