'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Zap, Shield, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    { icon: Calendar, title: 'Agenda Inteligente', desc: 'Calendario en tiempo real con disponibilidad instantánea.' },
    { icon: Users, title: 'Multi-Tenant', desc: 'Cada negocio con sus datos completamente aislados.' },
    { icon: Zap, title: 'Automación WhatsApp', desc: 'Respuestas automáticas y recordatorios inteligentes.' },
    { icon: Shield, title: 'Seguridad', desc: 'Protegido con Supabase y JWT.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">TurnoSaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors">Iniciar Sesión</Link>
            <Link href="/register" className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all">Comenzar Gratis</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-300 bg-clip-text text-transparent">
              Reservas de Turnos<br/>
              <span className="text-blue-400">Simplificadas</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              Plataforma SaaS completa para gestionar turnos, automatizar WhatsApp y escalar tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2">
                Crear Cuenta Gratis <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="px-8 py-4 rounded-xl glass-card text-white font-semibold text-lg hover:bg-slate-800/70 transition-all flex items-center justify-center gap-2">
                Ver Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:scale-105 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Planes Flexibles</h2>
            <p className="text-slate-400">Elige el plan perfecto para tu negocio</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Básico', price: '$19', features: ['1 profesional', 'Agenda básica', 'Hasta 100 reservas'] },
              { name: 'Pro', price: '$49', features: ['Profesionales ilimitados', 'Estadísticas', 'Branding personalizado'], popular: true },
              { name: 'Premium', price: '$99', features: ['Todo Pro', 'Múltiples sucursales', 'API y reportes'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`p-8 rounded-2xl ${plan.popular ? 'border-2 border-blue-500 bg-gradient-to-b from-blue-950/30 to-slate-900/50 scale-105' : 'glass-card'}`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-extrabold mb-6">{plan.price}<span className="text-base text-slate-400 font-normal">/mes</span></div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300"><CheckCircle className="w-5 h-5 text-blue-400" />{f}</li>
                  ))}
                </ul>
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all">Elegir Plan</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
