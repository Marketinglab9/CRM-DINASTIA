'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Syringe,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Filter
} from 'lucide-react'

async function fetchMyVaccinations() {
  const response = await fetch('/api/pet-vaccinations?owner=me')
  if (!response.ok) {
    throw new Error('Failed to fetch vaccinations')
  }
  return response.json()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getVaccinationStatusIcon = (status: string) => {
  switch (status) {
    case 'DUE':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case 'SCHEDULED':
      return <Clock className="h-4 w-4 text-blue-500" />
    case 'DONE':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'OVERDUE':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Calendar className="h-4 w-4 text-gray-500" />
  }
}

const getVaccinationStatusBadge = (status: string) => {
  const statusMap = {
    DUE: { label: 'Pendiente', variant: 'destructive' as const },
    SCHEDULED: { label: 'Programada', variant: 'default' as const },
    DONE: { label: 'Completada', variant: 'secondary' as const },
    OVERDUE: { label: 'Vencida', variant: 'destructive' as const },
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  )
}

function VaccinationCard({ vaccination }: { vaccination: any }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              {getVaccinationStatusIcon(vaccination.status)}
              <h3 className="font-medium">{vaccination.vaccine?.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {vaccination.vaccine?.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Programada: {formatDate(vaccination.scheduledDate)}</span>
              </div>
              <div className="font-medium text-primary">
                {vaccination.pet?.name}
              </div>
            </div>
            {vaccination.completedDate && (
              <div className="text-sm text-green-600">
                Completada: {formatDate(vaccination.completedDate)}
              </div>
            )}
            {vaccination.notes && (
              <p className="text-xs text-muted-foreground italic">
                {vaccination.notes}
              </p>
            )}
          </div>
          <div className="ml-4">
            {getVaccinationStatusBadge(vaccination.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VaccinesPage() {
  const {
    data: vaccinations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-vaccinations'],
    queryFn: fetchMyVaccinations,
  })

  const filterByStatus = (status: string) => {
    if (!vaccinations) return []
    return vaccinations.filter((v: any) => v.status === status)
  }

  const getStatusCounts = () => {
    if (!vaccinations) return { due: 0, scheduled: 0, done: 0, overdue: 0 }
    return {
      due: vaccinations.filter((v: any) => v.status === 'DUE').length,
      scheduled: vaccinations.filter((v: any) => v.status === 'SCHEDULED').length,
      done: vaccinations.filter((v: any) => v.status === 'DONE').length,
      overdue: vaccinations.filter((v: any) => v.status === 'OVERDUE').length,
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar vacunas</CardTitle>
            <CardDescription>
              No se pudieron cargar las vacunas. Por favor, intenta de nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const counts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario de Vacunas</h1>
          <p className="text-muted-foreground">
            Seguimiento completo de vacunación para todas tus mascotas
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{counts.due}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{counts.scheduled}</div>
                <div className="text-sm text-muted-foreground">Programadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{counts.done}</div>
                <div className="text-sm text-muted-foreground">Completadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{counts.overdue}</div>
                <div className="text-sm text-muted-foreground">Vencidas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Todas ({vaccinations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="due">
            Pendientes ({counts.due})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Programadas ({counts.scheduled})
          </TabsTrigger>
          <TabsTrigger value="done">
            Completadas ({counts.done})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            Vencidas ({counts.overdue})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : vaccinations?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Syringe className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-4">No hay vacunas programadas</h3>
                <p className="text-muted-foreground text-center">
                  Cuando tengas mascotas entregadas, sus vacunas aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {vaccinations?.map((vaccination: any) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="due" className="space-y-4">
          {filterByStatus('DUE').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                <h3 className="text-xl font-medium mb-4">¡No hay vacunas pendientes!</h3>
                <p className="text-muted-foreground text-center">
                  Todas las vacunas están al día.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterByStatus('DUE').map((vaccination: any) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {filterByStatus('SCHEDULED').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-4">No hay vacunas programadas</h3>
                <p className="text-muted-foreground text-center">
                  No tienes citas programadas próximamente.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterByStatus('SCHEDULED').map((vaccination: any) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="done" className="space-y-4">
          {filterByStatus('DONE').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Syringe className="h-16 w-16 text-muted-foreground mb-6" />
                <h3 className="text-xl font-medium mb-4">No hay vacunas completadas</h3>
                <p className="text-muted-foreground text-center">
                  Las vacunas completadas aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterByStatus('DONE').map((vaccination: any) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {filterByStatus('OVERDUE').length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                <h3 className="text-xl font-medium mb-4">¡Excelente!</h3>
                <p className="text-muted-foreground text-center">
                  No tienes vacunas vencidas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterByStatus('OVERDUE').map((vaccination: any) => (
                <VaccinationCard key={vaccination.id} vaccination={vaccination} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}