import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FolderOpen, Pencil, Trash2 } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import type { PaginatedResponse, Project } from '../../types'

const statusColor: Record<string, 'green' | 'blue' | 'yellow' | 'gray' | 'red'> = {
  en_ejecucion: 'green', adjudicado: 'blue', licitacion: 'yellow',
  suspendido: 'red', terminado: 'gray', liquidado: 'gray'
}

function formatCurrency(v: string) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v))
}

export default function ProjectList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<PaginatedResponse<Project>>({
    queryKey: ['projects', search, page],
    queryFn: async () => (await api.get('/projects/projects/', { params: { search, page } })).data,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/projects/projects/${id}/`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleteId(null)
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500 text-sm">{data?.count ?? 0} proyectos en el sistema</p>
        </div>
        <Link
          to="/projects/new"
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Nuevo Proyecto
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, nombre, municipio..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : data?.results.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No se encontraron proyectos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Código</th>
                    <th className="text-left px-6 py-3">Nombre</th>
                    <th className="text-left px-6 py-3">Tipo</th>
                    <th className="text-left px-6 py-3">Municipio</th>
                    <th className="text-left px-6 py-3">Valor Contrato</th>
                    <th className="text-left px-6 py-3">Estado</th>
                    <th className="text-left px-6 py-3">Director</th>
                    <th className="text-left px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.results.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link to={`/projects/${p.id}`} className="font-mono font-medium text-blue-600 hover:underline">
                          {p.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500">{p.project_type_display}</td>
                      <td className="px-6 py-4 text-gray-500">{p.municipality}</td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(p.contract_value)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColor[p.status] || 'gray'}>{p.status_display}</Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.director_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/projects/${p.id}/edit`)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
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

      {data && data.count > 20 && (
        <Pagination count={data.count} page={page} onPageChange={setPage} />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Eliminar Proyecto"
        message="¿Está seguro de que desea eliminar este proyecto? Esta acción no se puede deshacer."
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
