'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Role } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn, Heart, Users, PawPrint } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Redirect based on role
      switch (session.user.role) {
        case Role.ADMIN:
        case Role.ADVISOR:
          router.push('/dashboard')
          break
        case Role.CLIENT:
          router.push('/client')
          break
        default:
          router.push('/dashboard')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <PawPrint className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dinastía Cachorros
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema integral de gestión para criaderos profesionales. 
            Controla ventas, clientes, entregas y el cuidado de tus cachorros.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => router.push('/login')}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Acceder al Sistema
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Gestión de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Administra leads, convierte prospectos en ventas y mantén un seguimiento completo de tus clientes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PawPrint className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Control de Cachorros</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registra el inventario, estados de salud, vacunación y toda la información de tus mascotas.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Cuidado Integral</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Programa recordatorios de vacunación, seguimiento post-venta y guías de cuidado para los nuevos dueños.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>¿Listo para comenzar?</CardTitle>
              <CardDescription>
                Inicia sesión con tu cuenta para acceder a todas las funcionalidades del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => router.push('/login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
