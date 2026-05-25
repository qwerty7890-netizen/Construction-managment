import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'
import api from '../../api/client'
import { Card, CardBody } from '../../components/ui/Card'
import type { PaginatedResponse, DailyLog } from '../../types'

export default function LogList() {
  const { data, isLoading } = useQuery<PaginatedResponse<DailyLog>>({
    queryKey: ['daily-logs'],
    queryFn: async () => (await api.get('/logs/daily-logs/')).data,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bitácora Diaria</h1>
          <p className="text-gray-500 text-sm">{data?.count ?? 0} registros</p>
        </div>
        <Link to="/logs/new" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg">
          <Plus size={18} />Nuevo Registro
        </Link>
      </div>
      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <p className="text-center py-10 text-gray-400">Cargando...</p>
          ) : !data?.results.length ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No hay registros en la bitácora.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-6 py-3">Fecha</th>
                  <th className="text-left px-6 py-3">Proyecto</th>
                  <th className="text-left px-6 py-3">Clima</th>
                  <th className="text-right px-6 py-3">Actividades</th>
                  <th className="text-right px-6 py-3">Incidentes</th>
                  <th className="text-left px-6 py-3">Registrado por</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.results.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{log.date}</td>
                    <td className="px-6 py-4 text-gray-700">{log.project_name} <span className="text-gray-400 font-mono text-xs">({log.project_code})</span></td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{log.weather_morning}</td>
                    <td className="px-6 py-4 text-right">{log.activities_count}</td>
                    <td className="px-6 py-4 text-right">{log.incidents_count}</td>
                    <td className="px-6 py-4 text-gray-500">{log.created_by_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
