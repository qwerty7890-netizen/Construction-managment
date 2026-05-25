import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Building2, Users, FileText, Plus } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import type { PaginatedResponse } from '../../types'

interface Client { id: number; name: string; client_type_display: string; nit: string; city: string; is_active: boolean }
interface Contractor { id: number; name: string; specialty_display: string; nit: string; city: string; is_active: boolean }

export default function AdministrationList() {
  const [activeTab, setActiveTab] = useState<'clients' | 'contractors'>('clients')

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
          <p className="text-gray-500 text-sm">Clientes, contratistas y contratos</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'clients' ? (
            <Link to="/administration/clients/new" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={18} />Nuevo Cliente
            </Link>
          ) : (
            <Link to="/administration/contractors/new" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
              <Plus size={18} />Nuevo Contratista
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Clientes" value={clients?.count ?? 0} icon={Building2} color="bg-blue-500" />
        <StatCard title="Contratistas" value={contractors?.count ?? 0} icon={Users} color="bg-purple-500" />
        <StatCard title="Contratos Activos" value="—" icon={FileText} color="bg-green-500" />
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {(['clients', 'contractors'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-yellow-400 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab === 'clients' ? `Clientes (${clients?.count ?? 0})` : `Contratistas (${contractors?.count ?? 0})`}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'clients' && (
        <Card>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Nombre</th>
                  <th className="text-left px-6 py-3">Tipo</th>
                  <th className="text-left px-6 py-3">NIT</th>
                  <th className="text-left px-6 py-3">Ciudad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients?.results.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-3 text-gray-500">{c.client_type_display}</td>
                    <td className="px-6 py-3 font-mono text-gray-500">{c.nit}</td>
                    <td className="px-6 py-3 text-gray-500">{c.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!clients?.results.length && (
              <p className="text-center py-10 text-gray-400">No hay clientes registrados</p>
            )}
          </CardBody>
        </Card>
      )}

      {activeTab === 'contractors' && (
        <Card>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Nombre</th>
                  <th className="text-left px-6 py-3">Especialidad</th>
                  <th className="text-left px-6 py-3">NIT</th>
                  <th className="text-left px-6 py-3">Ciudad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contractors?.results.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-3 text-gray-500">{c.specialty_display}</td>
                    <td className="px-6 py-3 font-mono text-gray-500">{c.nit}</td>
                    <td className="px-6 py-3 text-gray-500">{c.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!contractors?.results.length && (
              <p className="text-center py-10 text-gray-400">No hay contratistas registrados</p>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  )
}
