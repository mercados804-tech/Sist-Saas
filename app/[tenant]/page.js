'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Calendar, Clock, User, Phone, Mail, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const BookingSchema = Yup.object().shape({
  firstName: Yup.string().required('Nombre obligatorio'),
  lastName: Yup.string().required('Apellido obligatorio'),
  email: Yup.string().email('Email inválido').required('Email obligatorio'),
  phone: Yup.string().required('Teléfono obligatorio').min(8, 'Mínimo 8 caracteres'),
  notes: Yup.string(),
})

export default function PublicBookingPage({ params }) {
  const [tenant, setTenant] = useState(null)
  const [services, setServices] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [availableTimes, setAvailableTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [reservationId, setReservationId] = useState(null)

  useEffect(() => {
    loadTenantData()
  }, [params.tenant])

  const loadTenantData = async () => {
    setLoading(true)
    try {
      // Load tenant
      const { data: tenantData } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', params.tenant)
        .single()

      if (tenantData) {
        setTenant(tenantData)

        // Load services
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .eq('tenant_id', tenantData.id)
          .eq('is_active', true)
        setServices(servicesData || [])

        // Load employees
        const { data: employeesData } = await supabase
          .from('employees')
          .select('*')
          .eq('tenant_id', tenantData.id)
          .eq('is_active', true)
        setEmployees(employeesData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSlots = () => {
    const times = []
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
      }
    }
    return times
  }

  useEffect(() => {
    setAvailableTimes(generateTimeSlots())
  }, [selectedDate, selectedService, selectedEmployee])

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep(2)
  }

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee)
    setStep(3)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep(4)
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
    },
    validationSchema: BookingSchema,
    onSubmit: async (values) => {
      // Create customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          tenant_id: tenant.id,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          notes: values.notes,
        })
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
        return
      }

      // Create reservation
      const [hours, minutes] = selectedTime.split(':')
      const startDateTime = new Date(selectedDate)
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const endDateTime = new Date(startDateTime)
      endDateTime.setMinutes(endDateTime.getMinutes() + selectedService.duration)

      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          tenant_id: tenant.id,
          service_id: selectedService.id,
          employee_id: selectedEmployee.id,
          customer_id: customerData.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'pending',
          notes: values.notes,
        })
        .select()
        .single()

      if (reservationError) {
        console.error('Error creating reservation:', reservationError)
        return
      }

      setReservationId(reservationData.id)
      setBookingComplete(true)
    },
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">Cargando...</div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">Negocio no encontrado</div>
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-lg w-full p-8 rounded-2xl text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">¡Reserva Confirmada!</h1>
          <p className="text-slate-400 mb-8">
            Te enviaremos un email con los detalles.
          </p>
          <div className="p-4 rounded-xl bg-slate-800/50 text-left mb-8">
            <p className="mb-2"><strong>Servicio:</strong> {selectedService?.name}</p>
            <p className="mb-2"><strong>Profesional:</strong> {selectedEmployee?.name}</p>
            <p className="mb-2"><strong>Fecha:</strong> {selectedDate.toLocaleDateString('es-ES')}</p>
            <p><strong>Hora:</strong> {selectedTime}</p>
          </div>
          <p className="text-slate-400 mb-4">Para completar el pago, realiza la transferencia:</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90"
          >
            Hacer otra reserva
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {tenant.logo_url && <img src={tenant.logo_url} alt={tenant.name} className="w-20 h-20 rounded-xl mx-auto mb-4 object-cover" />}
          <h1 className="text-4xl font-bold mb-2">{tenant.name}</h1>
          <p className="text-slate-400">Reserva tu turno</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{s}</div>
              {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-blue-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8 rounded-2xl">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Selecciona un servicio
              </h2>
              <div className="grid gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="p-5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
                        {service.description && <p className="text-slate-400 text-sm mb-2">{service.description}</p>}
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.duration} min</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-blue-400">${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Employee */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
                <ChevronLeft className="w-5 h-5" /> Volver
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                Selecciona un profesional
              </h2>
              <div className="grid gap-4">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleEmployeeSelect(employee)}
                    className="p-5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold">
                        {employee.name.charAt(0)}
                      </div>
                      <h3 className="text-lg font-semibold">{employee.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setStep(2)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
                <ChevronLeft className="w-5 h-5" /> Volver
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Selecciona fecha y hora
              </h2>

              {/* Date Picker */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}><ChevronLeft className="w-6 h-6" /></button>
                  <h3 className="text-xl font-semibold">{selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}><ChevronRight className="w-6 h-6" /></button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - 3)
                    const isToday = d.toDateString() === new Date().toDateString()
                    const isSelected = d.toDateString() === selectedDate.toDateString()
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(new Date(d))}
                        className={`py-3 rounded-lg text-center transition-all ${isSelected ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : isToday ? 'border border-blue-500' : 'hover:bg-slate-800'}`}
                      >
                        {d.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <h3 className="text-lg font-semibold mb-4">Horarios disponibles</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`py-3 rounded-xl font-semibold transition-all ${selectedTime === time ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Personal Info */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => setStep(3)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
                <ChevronLeft className="w-5 h-5" /> Volver
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" />
                Tus datos
              </h2>

              {/* Summary */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700 mb-8">
                <h3 className="font-semibold mb-4">Resumen de la reserva</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-400">Servicio:</span> <span className="font-medium">{selectedService?.name}</span></div>
                  <div><span className="text-slate-400">Profesional:</span> <span className="font-medium">{selectedEmployee?.name}</span></div>
                  <div><span className="text-slate-400">Fecha:</span> <span className="font-medium">{selectedDate.toLocaleDateString('es-ES')}</span></div>
                  <div><span className="text-slate-400">Hora:</span> <span className="font-medium">{selectedTime}</span></div>
                  <div><span className="text-slate-400">Duración:</span> <span className="font-medium">{selectedService?.duration} min</span></div>
                  <div><span className="text-slate-400">Precio:</span> <span className="font-medium text-blue-400">${selectedService?.price}</span></div>
                </div>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4" /> Nombre
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.firstName}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{formik.errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.lastName}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{formik.errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{formik.errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Notas (opcional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.notes}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg hover:opacity-90 transition-all"
                >
                  Confirmar Reserva
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
