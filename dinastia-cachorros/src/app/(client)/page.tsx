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
  const {
    data: clientData,
    isLoading: clientLoading,
    error: clientError,
    refetch: refetchClient
  } = useQuery({
    queryKey: ['client-data'],
    queryFn: fetchClientData,
  })

  const {
    data: upcomingVaccinations,
    isLoading: vaccinationsLoading,
    error: vaccinationsError,
    refetch: refetchVaccinations
  } = useQuery({
    queryKey: ['upcoming-vaccinations'],
    queryFn: fetchUpcomingVaccinations,
  })

  if (clientError || vaccinationsError) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar datos</CardTitle>
            <CardDescription>
              No se pudieron cargar tus datos. Por favor, intenta de nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => {
              refetchClient()
              refetchVaccinations()
            }}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Portal</h1>
          <p className="text-muted-foreground">
            {clientLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              `Bienvenido, ${clientData?.profile?.user?.name || 'Usuario'}`
            )}
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
          {clientLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{clientData?.profile?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{clientData?.profile?.user?.phone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{clientData?.profile?.city || 'No especificado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cliente desde {clientData?.profile?.user?.createdAt ? formatDate(clientData.profile.user.createdAt) : ''}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Pets */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-semibold">Mis Mascotas</h2>
        {clientLoading ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardHeader>
          </Card>
        ) : clientData?.pets?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes mascotas registradas</h3>
              <p className="text-sm text-muted-foreground text-center">
                Cuando realices una compra, tus mascotas aparecerán aquí.
              </p>
            </CardContent>
          </Card>
        ) : (
          clientData?.pets?.map((pet: any) => {
            const vaccinationProgress = pet.vaccinations ? 
              Math.round((pet.vaccinations.filter((v: any) => v.status === 'DONE').length / pet.vaccinations.length) * 100) : 0
            const nextVaccination = pet.vaccinations?.find((v: any) => v.status === 'DUE' || v.status === 'SCHEDULED')
            
            return (
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
                        {pet.breed?.name} • {pet.sex === 'MALE' ? 'Macho' : 'Hembra'} • {pet.color}
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
                          <span>{vaccinationProgress}%</span>
                        </div>
                        <Progress value={vaccinationProgress} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Próxima Vacuna</h4>
                      {nextVaccination ? (
                        <div className="flex items-center gap-2">
                          <Syringe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(nextVaccination.scheduledDate)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Al día</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
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
            {vaccinationsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : upcomingVaccinations?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">¡Al día con las vacunas!</h3>
                <p className="text-sm text-muted-foreground text-center">
                  No tienes vacunas pendientes próximamente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingVaccinations?.map((vaccination: any) => (
                  <div key={vaccination.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getVaccinationStatusIcon(vaccination.status)}
                        <p className="text-sm font-medium">
                          {vaccination.vaccine?.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vaccination.vaccine?.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vaccination.pet?.name} • {formatDate(vaccination.scheduledDate)}
                      </p>
                    </div>
                    <div>
                      {getVaccinationStatusBadge(vaccination.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {clientData?.pets?.map((pet: any) => (
                <div key={`care-guide-${pet.id}`} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Guía de Cuidados - {pet.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Guía completa de cuidados para {pet.breed?.name}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/api/downloads/care-guide?petId=${pet.id}`} target="_blank">
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </a>
                  </Button>
                </div>
              ))}
              
              {clientData?.invoices?.map((invoice: any) => (
                <div key={`invoice-${invoice.id}`} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Factura {invoice.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Factura de compra ({formatDate(invoice.issuedAt)})
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
                      <Download className="h-3 w-3 mr-1" />
                      Descargar
                    </a>
                  </Button>
                </div>
              ))}
              
              {(!clientData?.pets?.length && !clientData?.invoices?.length) && (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay documentos disponibles</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Los documentos aparecerán aquí cuando realices compras.
                  </p>
                </div>
              )}
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
          {clientLoading ? (
            <div className="space-y-4">
              {[1].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : clientData?.invoices?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes facturas</h3>
              <p className="text-sm text-muted-foreground text-center">
                Tus facturas aparecerán aquí cuando realices compras.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientData?.invoices?.slice(0, 3).map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Factura {invoice.number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Compra de {invoice.sale?.pet?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(invoice.issuedAt)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">
                      {formatCurrency(invoice.total)}
                    </p>
                    <Badge variant="outline">
                      Pagado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}