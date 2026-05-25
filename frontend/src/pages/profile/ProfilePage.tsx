import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { User, Lock, CheckCircle } from 'lucide-react'
import api from '../../api/client'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import FormField from '../../components/ui/FormField'
import { useAuthStore } from '../../store/authStore'

const profileSchema = z.object({
  first_name: z.string().min(1, 'Requerido'),
  last_name: z.string().min(1, 'Requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  old_password: z.string().min(1, 'Requerido'),
  new_password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm_password: z.string().min(1, 'Requerido'),
}).refine((d) => d.new_password === d.confirm_password, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm_password'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador', gerente: 'Gerente', director_obra: 'Director de Obra',
  residente: 'Residente', almacenista: 'Almacenista', contador: 'Contador',
  rrhh: 'Recursos Humanos', operador: 'Operador', conductor: 'Conductor', visor: 'Visor',
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400'

export default function ProfilePage() {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/users/me/')).data,
  })

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: me ? {
      first_name: me.first_name,
      last_name: me.last_name,
      email: me.email,
      phone: me.phone || '',
    } : undefined,
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const profileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => (await api.patch('/users/me/', data)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setUser(data)
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    },
  })

  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordForm) =>
      (await api.post('/users/change_password/', {
        old_password: data.old_password,
        new_password: data.new_password,
      })).data,
    onSuccess: () => {
      passwordForm.reset()
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    },
  })

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 text-sm">Actualiza tu información personal</p>
      </div>

      {/* Profile info */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            Información Personal
          </h2>
        </CardHeader>
        <CardBody>
          {me && (
            <div className="mb-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-xl">
                {me.first_name?.[0]}{me.last_name?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{me.username}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {ROLE_LABELS[me.role] || me.role}
                </span>
              </div>
            </div>
          )}
          <form onSubmit={profileForm.handleSubmit((d) => profileMutation.mutate(d))} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nombre" required error={profileForm.formState.errors.first_name?.message}>
                <input {...profileForm.register('first_name')} className={inputClass} />
              </FormField>
              <FormField label="Apellido" required error={profileForm.formState.errors.last_name?.message}>
                <input {...profileForm.register('last_name')} className={inputClass} />
              </FormField>
            </div>
            <FormField label="Email" required error={profileForm.formState.errors.email?.message}>
              <input {...profileForm.register('email')} type="email" className={inputClass} />
            </FormField>
            <FormField label="Teléfono" error={profileForm.formState.errors.phone?.message}>
              <input {...profileForm.register('phone')} className={inputClass} placeholder="+57 300 000 0000" />
            </FormField>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {profileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              {profileSuccess && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle size={16} /> Actualizado correctamente
                </span>
              )}
              {profileMutation.isError && (
                <span className="text-red-500 text-sm">Error al guardar</span>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lock size={18} className="text-red-500" />
            Cambiar Contraseña
          </h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={passwordForm.handleSubmit((d) => passwordMutation.mutate(d))} className="space-y-4">
            <FormField label="Contraseña Actual" required error={passwordForm.formState.errors.old_password?.message}>
              <input {...passwordForm.register('old_password')} type="password" className={inputClass} autoComplete="current-password" />
            </FormField>
            <FormField label="Nueva Contraseña" required error={passwordForm.formState.errors.new_password?.message}>
              <input {...passwordForm.register('new_password')} type="password" className={inputClass} autoComplete="new-password" />
            </FormField>
            <FormField label="Confirmar Contraseña" required error={passwordForm.formState.errors.confirm_password?.message}>
              <input {...passwordForm.register('confirm_password')} type="password" className={inputClass} autoComplete="new-password" />
            </FormField>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {passwordMutation.isPending ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
              {passwordSuccess && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle size={16} /> Contraseña actualizada
                </span>
              )}
              {passwordMutation.isError && (
                <span className="text-red-500 text-sm">Contraseña actual incorrecta</span>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
