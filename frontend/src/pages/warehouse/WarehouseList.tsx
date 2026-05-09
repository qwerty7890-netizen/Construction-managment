import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, Search } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import type { PaginatedResponse, Material } from '../../types'

export default function WarehouseList() {
  const [search, setSearch] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)

  const { data, isLoading } = useQuery<PaginatedResponse<Material>>({
    queryKey: ['materials', search],
    queryFn: async () => (await api.get('/warehouse/materials/', { params: { search } })).data,
  })

  const { data: lowStockData } = useQuery<Material[]>({
    queryKey: ['materials-low-stock'],
    queryFn: async () => (await api.get('/warehouse/materials/low_stock/')).data,
  })

  const materials = showLowStock ? (lowStockData || []) : (data?.results || [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Almacén de Materiales</h1>
        <p className="text-gray-500 text-sm">{data?.count ?? 0} materiales registrados</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Materiales" value={data?.count ?? 0} icon={Package} color="bg-blue-500" />
        <StatCard title="Bajo Stock" value={lowStockData?.length ?? 0} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar material..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showLowStock ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showLowStock ? 'Mostrar todos' : 'Solo bajo stock'}
            </button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-6 py-3">Código</th>
                    <th className="text-left px-6 py-3">Material</th>
                    <th className="text-left px-6 py-3">Categoría</th>
                    <th className="text-left px-6 py-3">Unidad</th>
                    <th className="text-right px-6 py-3">Stock Actual</th>
                    <th className="text-right px-6 py-3">Stock Mínimo</th>
                    <th className="text-right px-6 py-3">Precio Unit.</th>
                    <th className="text-left px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {materials.map((m) => (
                    <tr key={m.id} className={`hover:bg-gray-50 ${m.is_low_stock ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 font-mono text-blue-600">{m.code}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                      <td className="px-6 py-4 text-gray-500">{m.category_name}</td>
                      <td className="px-6 py-4 text-gray-500">{m.unit}</td>
                      <td className="px-6 py-4 text-right font-medium">{Number(m.current_stock).toLocaleString('es-CO', { maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right text-gray-500">{Number(m.minimum_stock).toLocaleString('es-CO', { maximumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-right">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(m.unit_price))}
                      </td>
                      <td className="px-6 py-4">
                        {m.is_low_stock ? <Badge variant="red">Bajo Stock</Badge> : <Badge variant="green">OK</Badge>}
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
