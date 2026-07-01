import "./globals.css"

export const metadata = {
  title: "Sistema de Reserva de Turnos SaaS",
  description: "Aplicación SaaS de reservas de turnos online",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  )
}
