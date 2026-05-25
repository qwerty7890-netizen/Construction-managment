import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Truck, Pencil, Trash2 } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import type { PaginatedResponse, Equipment } from '../../types'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray' | 'red' | 'orange'> = {
  disponible: 'green', asignado: 'blue', mantenimiento: 'yellow', danado: 'red', inactivo: 'gray'
}

export default function EquipmentList() {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PaginatedResponse<Equipment>>({
    queryKey: ['equipment', search],
    queryFn: async () => (await api.get('/equipment/equipment/', { params: { search } })).data,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/equipment/equipment/${id}/`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] })
      setDeleteId(null)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipos y Maquinaria</h1>
          <p className="text-gray-500 text-sm">{data?.count ?? 0} equipos registrados</p>
        </div>
        <Link
          to="/equipment/new"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Nuevo Equipo
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, nombre, placa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16">
              <Truck size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No se encontraron equipos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Código</th>
                    <th className="text-left px-6 py-3">Nombre</th>
                    <th className="text-left px-6 py-3">Tipo</th>
                    <th className="text-left px-6 py-3">Marca/Modelo</th>
                    <th className="text-left px-6 py-3">Placa</th>
                    <th className="text-left px-6 py-3">Horómetro</th>
                    <th className="text-left px-6 py-3">Estado</th>
                    <th className="text-left px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.results.map((eq) => (
                    <tr key={eq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-medium text-blue-600">
                        <Link to={`/equipment/${eq.id}`} className="hover:underline">{eq.code}</Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{eq.name}</td>
                      <td className="px-6 py-4 text-gray-500">{eq.equipment_type_display}</td>
                      <td className="px-6 py-4 text-gray-500">{eq.brand} {eq.model}</td>
                      <td className="px-6 py-4 font-mono">{eq.plate || '—'}</td>
                      <td className="px-6 py-4">{Number(eq.current_hourmeter).toLocaleString('es-CO')} h</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor[eq.status] || 'gray'}>{eq.status_display}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/equipment/${eq.id}/edit`)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(eq.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Eliminar Equipo"
        message="¿Está seguro de que desea eliminar este equipo? Esta acción no se puede deshacer."
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
