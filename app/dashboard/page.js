'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, DollarSign, TrendingUp, Clock, Settings, Menu, LogOut } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayReservations: 5,
    nextReservation: null,
    monthlyRevenue: 1500,
    newCustomers: 12,
  })
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    checkUser()
    loadReservations()
  }, [])

  const checkUser = async () => {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  const loadReservations = async () => {
    // Mock data for demonstration
    const mockReservations = [
      {
        id: '1',
        customer: { first_name: 'Juan', last_name: 'Pérez' },
        service: { name: 'Corte de pelo', duration: 30, price: 25 },
        employee: { name: 'María' },
        start_time: new Date(Date.now() + 3600000).toISOString(),
        status: 'confirmed'
      },
      {
        id: '2',
        customer: { first_name: 'Ana', last_name: 'García' },
        service: { name: 'Manicura', duration: 45, price: 35 },
        employee: { name: 'María' },
        start_time: new Date(Date.now() + 7200000).toISOString(),
        status: 'pending'
      }
    ]
    setReservations(mockReservations)
  }

  const handleLogout = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 hidden md:block">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">TurnoSaaS</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-300">
              <Calendar className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/reservations" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-300">
              <Clock className="w-5 h-5" />
              Reservas
            </Link>
            <Link href="/dashboard/services" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-300">
              <Settings className="w-5 h-5" />
              Servicios
            </Link>
            <Link href="/dashboard/customers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-300">
              <Users className="w-5 h-5" />
              Clientes
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 text-slate-300">
              <Settings className="w-5 h-5" />
              Configuración
            </Link>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-950/30 text-red-400"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-slate-400 mt-1">Bienvenido de nuevo!</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.todayReservations}</h3>
              <p className="text-slate-400 text-sm">Reservas hoy</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">Próximo turno</h3>
              <p className="text-slate-400 text-sm">En 1 hora</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">${stats.monthlyRevenue}</h3>
              <p className="text-slate-400 text-sm">Ingresos mensuales</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.newCustomers}</h3>
              <p className="text-slate-400 text-sm">Nuevos clientes</p>
            </motion.div>
          </div>

          {/* Today's Reservations */}
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Reservas de hoy</h2>
            <div className="space-y-4">
              {reservations.map((res, index) => (
                <motion.div 
                  key={res.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold">
                      {res.customer.first_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{res.customer.first_name} {res.customer.last_name}</h4>
                      <p className="text-slate-400 text-sm">{res.service.name} • {new Date(res.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {res.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
