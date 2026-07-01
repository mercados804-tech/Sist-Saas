'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import { Calendar, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email obligatorio'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña obligatoria'),
  businessName: Yup.string().required('Nombre del negocio obligatorio'),
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const formik = useFormik({
    initialValues: { email: '', password: '', businessName: '' },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setError('')
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              business_name: values.businessName,
              role: 'admin',
            },
          },
        })
        if (authError) throw authError
        setSuccess(true)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
  })

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-md p-8 rounded-2xl text-center"
        >
          <h1 className="text-3xl font-bold mb-4">¡Cuenta creada!</h1>
          <p className="text-slate-400 mb-6">
            Verifica tu email para confirmar la cuenta.
          </p>
          <Link href="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold">
            Ir a Iniciar Sesión
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
          <p className="text-slate-400">Comienza tu prueba gratis</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Nombre del Negocio</label>
            <input
              type="text"
              name="businessName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.businessName}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="Tu Negocio"
            />
            {formik.touched.businessName && formik.errors.businessName && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.businessName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="tu@email.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-400 hover:text-blue-300">Inicia Sesión</Link>
        </div>
      </motion.div>
    </div>
  )
}
