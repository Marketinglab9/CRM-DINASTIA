'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  Heart,
  Calendar,
  Syringe,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

async function fetchPetDetails(petId: string) {
  const response = await fetch(`/api/pets/${petId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch pet details')
  }
  return response.json()
}

async function updateVaccination(vaccinationId: string, data: any) {
  const response = await fetch(`/api/pet-vaccinations/${vaccinationId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update vaccination')
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

export default function PetDetailPage() {
  const params = useParams()
  const petId = params.petId as string
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: pet,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pet-details', petId],
    queryFn: () => fetchPetDetails(petId),
  })

  const updateVaccinationMutation = useMutation({
    mutationFn: ({ vaccinationId, data }: { vaccinationId: string; data: any }) =>
      updateVaccination(vaccinationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-details', petId] })
      toast({
        title: 'Vacuna actualizada',
        description: 'El estado de la vacuna se ha actualizado correctamente.',
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la vacuna.',
        variant: 'destructive',
      })
    },
  })

  const handleVaccinationToggle = (vaccination: any, completed: boolean) => {
    const data = {
      status: completed ? 'DONE' : 'DUE',
      completedDate: completed ? new Date().toISOString() : undefined,
    }
    
    updateVaccinationMutation.mutate({
      vaccinationId: vaccination.id,
      data,
    })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar mascota</CardTitle>
            <CardDescription>
              No se pudieron cargar los datos de la mascota.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/client/pets">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-32" /> : pet?.name}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? <Skeleton className="h-5 w-48" /> : `Detalle de ${pet?.name}`}
          </p>
        </div>
      </div>

      {/* Pet Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Información de la Mascota
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={pet?.photoUrl} alt={pet?.name} />
                <AvatarFallback className="text-2xl">{pet?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-xl font-semibold">{pet?.name}</h3>
                  <p className="text-muted-foreground">{pet?.breed?.name}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Sexo:</span>
                      <Badge variant="secondary">
                        {pet?.sex === 'MALE' ? 'Macho' : 'Hembra'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Color:</span>
                      <span className="text-sm">{pet?.color}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Nacido el {formatDate(pet?.birthDate)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Edad: {calculateAge(pet?.birthDate)}
                    </div>
                  </div>
                </div>
                {pet?.notes && (
                  <div className="pt-2">
                    <span className="text-sm font-medium">Notas:</span>
                    <p className="text-sm text-muted-foreground mt-1">{pet.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vaccination Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Cartilla de Vacunación
          </CardTitle>
          <CardDescription>
            Marca las vacunas como completadas una vez aplicadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          ) : pet?.vaccinations?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Syringe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay vacunas programadas</h3>
              <p className="text-sm text-muted-foreground text-center">
                Las vacunas se programarán automáticamente después de la entrega.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pet?.vaccinations?.map((vaccination: any) => (
                <div key={vaccination.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {getVaccinationStatusIcon(vaccination.status)}
                      <span className="font-medium">{vaccination.vaccine?.name}</span>
                      {getVaccinationStatusBadge(vaccination.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vaccination.vaccine?.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Programada: {formatDate(vaccination.scheduledDate)}
                      {vaccination.completedDate && (
                        <span className="ml-4">
                          Completada: {formatDate(vaccination.completedDate)}
                        </span>
                      )}
                    </div>
                    {vaccination.notes && (
                      <p className="text-xs text-muted-foreground italic">
                        {vaccination.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`vaccination-${vaccination.id}`}
                      checked={vaccination.status === 'DONE'}
                      onCheckedChange={(checked) => handleVaccinationToggle(vaccination, checked)}
                      disabled={updateVaccinationMutation.isPending}
                    />
                    <Label htmlFor={`vaccination-${vaccination.id}`} className="text-sm">
                      Completada
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vaccination Progress */}
      {pet?.vaccinations?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Vacunación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {pet?.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Completadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {pet?.vaccinations?.filter((v: any) => v.status === 'DUE').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {pet?.vaccinations?.filter((v: any) => v.status === 'SCHEDULED').length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Programadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(((pet?.vaccinations?.filter((v: any) => v.status === 'DONE').length || 0) / (pet?.vaccinations?.length || 1)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Progreso</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}