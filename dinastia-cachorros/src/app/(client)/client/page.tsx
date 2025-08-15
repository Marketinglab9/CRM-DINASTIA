'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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
  FileText
} from 'lucide-react'

// Mock data for demonstration
const clientData = {
  name: 'Ana López',
  email: 'ana.lopez@email.com',
  phone: '+57 300 456 7890',
  city: 'Bogotá',
  address: 'Calle 123 #45-67',
  registrationDate: '2024-01-15',
}

const myPets = [
  {
    id: 1,
    name: 'Max',
    breed: 'Golden Retriever',
    birthDate: '2024-01-15',
    photoUrl: '/images/pets/max.jpg',
    sex: 'Macho',
    color: 'Dorado',
    status: 'delivered',
    purchaseDate: '2024-02-20',
    nextVaccine: '2024-12-25',
    vaccinationProgress: 75,
  }
]

const upcomingVaccinations = [
  {
    id: 1,
    petName: 'Max',
    vaccineName: 'Refuerzo Anual DHPP',
    scheduledDate: '2024-12-25',
    status: 'due',
    description: 'Refuerzo anual de DHPP',
  },
  {
    id: 2,
    petName: 'Max',
    vaccineName: 'Refuerzo Antirrábica',
    scheduledDate: '2025-01-15',
    status: 'scheduled',
    description: 'Refuerzo anual antirrábica',
  },
]

const recentInvoices = [
  {
    id: 1,
    number: 'DIN1001',
    petName: 'Max',
    amount: 2500000,
    date: '2024-02-20',
    status: 'paid',
  }
]

const availableDownloads = [
  {
    id: 1,
    name: 'Guía de Cuidados - Max',
    type: 'care-guide',
    description: 'Guía completa de cuidados para Golden Retriever',
  },
  {
    id: 2,
    name: 'Factura DIN1001',
    type: 'invoice',
    description: 'Factura de compra de Max',
  },
  {
    id: 3,
    name: 'Certificado de Vacunación',
    type: 'vaccination',
    description: 'Registro de vacunas aplicadas',
  },
]

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Portal</h1>
          <p className="text-muted-foreground">
            Bienvenido, {clientData.name}
          </p>
        </div>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mi Información
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.phone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{clientData.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Cliente desde {formatDate(clientData.registrationDate)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Pets */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Mis Mascotas</h2>
        {myPets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={pet.photoUrl} alt={pet.name} />
                  <AvatarFallback>{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  <CardDescription className="text-base">
                    {pet.breed} • {pet.sex} • {pet.color}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    {calculateAge(pet.birthDate)} • Nacido el {formatDate(pet.birthDate)}
                  </p>
                </div>
                <Badge variant="outline">
                  Entregado
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Progreso de Vacunación</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completado</span>
                      <span>{pet.vaccinationProgress}%</span>
                    </div>
                    <Progress value={pet.vaccinationProgress} className="h-2" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Próxima Vacuna</h4>
                  <div className="flex items-center gap-2">
                    <Syringe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(pet.nextVaccine)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Vaccinations & Downloads */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Vaccinations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="h-5 w-5" />
              Próximas Vacunas
            </CardTitle>
            <CardDescription>
              Programa de vacunación pendiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingVaccinations.map((vaccination) => (
                <div key={vaccination.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getVaccinationStatusIcon(vaccination.status)}
                      <p className="text-sm font-medium">
                        {vaccination.vaccineName}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vaccination.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(vaccination.scheduledDate)}
                    </p>
                  </div>
                  <div>
                    {getVaccinationStatusBadge(vaccination.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Descargas
            </CardTitle>
            <CardDescription>
              Documentos y certificados disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableDownloads.map((download) => (
                <div key={download.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {download.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {download.description}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mis Facturas
          </CardTitle>
          <CardDescription>
            Historial de transacciones y facturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Factura {invoice.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Compra de {invoice.petName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(invoice.date)}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <Badge variant="outline">
                    Pagado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}