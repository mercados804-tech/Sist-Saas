# TurnoSaaS - Sistema de Reserva de Turnos

Sistema completo de reserva de turnos SaaS multi-tenant con Next.js, Supabase y Tailwind CSS.

## Características

- ✅ **Multi-Tenant**: Cada negocio tiene su propia instancia y datos aislados
- ✅ **Autenticación**: Registro, login, recuperación de contraseña con Supabase Auth
- ✅ **Página Pública de Reservas**: Calendario interactivo para clientes
- ✅ **Dashboard Profesional**: Gestión de turnos, estadísticas y clientes
- ✅ **Pago por Transferencia Bancaria**: Configuración de cuentas y carga de comprobantes
- ✅ **Automatización WhatsApp**: Respuestas automáticas, recordatorios y más
- ✅ **Diseño Dark Premium**: Glassmorphism, animaciones suaves, responsive

## Stack Tecnológico

- **Next.js 15** - App Router
- **React 19**
- **Tailwind CSS**
- **Supabase** - Auth, Database, Storage, Realtime
- **Formik & Yup** - Formularios y validaciones
- **Framer Motion** - Animaciones
- **Zustand** - State management

## Instalación

1. **Clonar el repositorio**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**:
   - Copiar `.env.example` a `.env.local`
   - Completar con tus credenciales de Supabase
4. **Configurar Supabase**:
   - Ejecutar el SQL desde `supabase-schema.sql` en tu proyecto Supabase
   - Habilitar Storage para comprobantes de pago
5. **Iniciar el servidor**:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
├── app/
│   ├── [tenant]/         # Página pública de reservas
│   ├── dashboard/        # Dashboard profesional
│   ├── login/            # Iniciar sesión
│   ├── register/         # Registrarse
│   ├── reset-password/   # Restablecer contraseña
│   ├── globals.css       # Estilos globales
│   ├── layout.js         # Layout principal
│   └── page.js           # Landing page
├── lib/
│   ├── supabase.js       # Cliente Supabase
│   └── utils.js          # Utilidades
├── supabase-schema.sql   # Schema de base de datos
└── package.json
```

## Uso

### Para Negocios
1. Registrarse en `/register`
2. Configurar servicios, horarios y datos bancarios
3. Compartir el enlace `tu-dominio.com/[slug-del-negocio]` con clientes

### Para Clientes
1. Acceder a la página pública del negocio
2. Seleccionar servicio, profesional, fecha y hora
3. Completar datos personales
4. Realizar pago por transferencia y subir comprobante

## Base de Datos

Las tablas principales son:
- `tenants` - Negocios
- `users` - Usuarios (admin, professional, client)
- `services` - Servicios ofrecidos
- `employees` - Profesionales
- `customers` - Clientes
- `reservations` - Reservas
- `bank_accounts` - Cuentas bancarias
- `payment_receipts` - Comprobantes de pago
- `whatsapp_messages` - Logs de mensajes WhatsApp

## Automatización WhatsApp

Se puede integrar con:
- Meta WhatsApp Cloud API
- Twilio
- Gupshup
- O cualquier proveedor compatible

Los webhooks se configuran en Supabase Edge Functions.

## Licencia

MIT
