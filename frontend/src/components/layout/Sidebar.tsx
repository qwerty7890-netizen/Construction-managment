import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, BookOpen, Truck, Package,
  Users, DollarSign, Calculator, Building2, LogOut, HardHat
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderOpen, label: 'Proyectos' },
  { to: '/logs', icon: BookOpen, label: 'Bitácoras' },
  { to: '/equipment', icon: Truck, label: 'Equipos' },
  { to: '/warehouse', icon: Package, label: 'Almacén' },
  { to: '/personnel', icon: Users, label: 'Personal' },
  { to: '/payroll', icon: DollarSign, label: 'Nómina' },
  { to: '/accounting', icon: Calculator, label: 'Contabilidad' },
  { to: '/administration', icon: Building2, label: 'Administración' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-50">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <HardHat className="text-yellow-400" size={28} />
        <div>
          <p className="font-bold text-sm leading-tight">ConstruGestión</p>
          <p className="text-xs text-gray-400">Sistema de Gestión</p>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-yellow-500 text-gray-900 font-semibold'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm mb-3 transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`
          }
        >
          <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-xs shrink-0">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white text-xs truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
