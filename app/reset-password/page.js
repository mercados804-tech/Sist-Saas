'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'

const ResetSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email obligatorio'),
})

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: ResetSchema,
    onSubmit: async (values) => {
      setLoading(true)
      setError('')
      try {
        const supabase = getSupabase()
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: window.location.origin + '/update-password',
        })
        if (error) throw error
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
          <h1 className="text-3xl font-bold mb-4">¡Email enviado!</h1>
          <p className="text-slate-400 mb-6">
            Revisa tu bandeja de entrada para restablecer la contraseña.
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
          <h1 className="text-3xl font-bold mb-2">Restablecer Contraseña</h1>
          <p className="text-slate-400">Ingresa tu email</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Link'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400">
          <Link href="/login" className="text-blue-400 hover:text-blue-300">Volver a Iniciar Sesión</Link>
        </div>
      </motion.div>
    </div>
  )
}
