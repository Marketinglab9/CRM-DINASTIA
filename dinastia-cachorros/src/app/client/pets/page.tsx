'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Heart,
  Calendar,
  Eye,
  RefreshCw
} from 'lucide-react'

async function fetchMyPets() {
  const response = await fetch('/api/pets?owner=me')
  if (!response.ok) {
    throw new Error('Failed to fetch pets')
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

export default function PetsPage() {
  const {
    data: pets,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-pets'],
    queryFn: fetchMyPets,
  })

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar mascotas</CardTitle>
            <CardDescription>
              No se pudieron cargar tus mascotas. Por favor, intenta de nuevo.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Mascotas</h1>
          <p className="text-muted-foreground">
            Gestiona la información de tus mascotas
          </p>
        </div>
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : pets?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-4">No tienes mascotas registradas</h3>
            <p className="text-muted-foreground text-center mb-6">
              Cuando realices una compra y se entregue tu mascota, aparecerá aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets?.map((pet: any) => (
            <Card key={pet.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={pet.photoUrl} alt={pet.name} />
                    <AvatarFallback className="text-lg">{pet.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {pet.breed?.name}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {pet.sex === 'MALE' ? 'Macho' : 'Hembra'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {pet.color}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Nacido el {formatDate(pet.birthDate)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Edad: {calculateAge(pet.birthDate)}
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link href={`/client/pets/${pet.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {pets?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{pets?.length}</div>
                <div className="text-sm text-muted-foreground">
                  {pets?.length === 1 ? 'Mascota' : 'Mascotas'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {pets?.filter((p: any) => p.sex === 'MALE').length}
                </div>
                <div className="text-sm text-muted-foreground">Machos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {pets?.filter((p: any) => p.sex === 'FEMALE').length}
                </div>
                <div className="text-sm text-muted-foreground">Hembras</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}