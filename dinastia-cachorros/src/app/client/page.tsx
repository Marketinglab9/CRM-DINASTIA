'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Syringe,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react'

async function fetchClientData() {
  const response = await fetch('/api/clients/me')
  if (!response.ok) {
    throw new Error('Failed to fetch client data')
  }
  return response.json()
}

async function fetchUpcomingVaccinations() {
  const response = await fetch('/api/pet-vaccinations?owner=me')
  if (!response.ok) {
    throw new Error('Failed to fetch vaccinations')
  }
  const data = await response.json()
  return data.filter((v: any) => v.status === 'DUE' || v.status === 'SCHEDULED').slice(0, 3)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  const ageInMs = today.getTime() - birth.getTime()
  const ageInMonths = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30.44))
  
  if (ageInMonths < 12) {
    return `${ageInMonths} meses`
  } else {
    const years = Math.floor(ageInMonths / 12)
    const months = ageInMonths % 12
    return months > 0 ? `${years} años, ${months} meses` : `${years} años`
  }
}

const getVaccinationStatusIcon = (status: string) => {
  switch (status) {
    case 'due':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case 'scheduled':
      return <Clock className="h-4 w-4 text-blue-500" />
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Calendar className="h-4 w-4 text-gray-500" />
  }
}

const getVaccinationStatusBadge = (status: string) => {
  const statusMap = {
    due: { label: 'Vencida', variant: 'destructive' as const },
    scheduled: { label: 'Programada', variant: 'default' as const },
    completed: { label: 'Completada', variant: 'secondary' as const },
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  )
}

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Portal - Dinastía Cachorros</h1>
        <p className="text-muted-foreground">
          Bienvenido al portal del cliente - TEST PAGE
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Estado del Sistema</h2>
          <p>✅ Login funcionando</p>
          <p>✅ Autenticación OK</p>
          <p>✅ Layout Cliente OK</p>
          <p>✅ Página cargando correctamente</p>
        </div>
      </div>
    </div>
  )
}