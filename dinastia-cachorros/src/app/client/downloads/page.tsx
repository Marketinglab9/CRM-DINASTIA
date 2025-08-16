'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Download,
  FileText,
  Heart,
  Syringe,
  RefreshCw
} from 'lucide-react'

async function fetchClientData() {
  const response = await fetch('/api/clients/me')
  if (!response.ok) {
    throw new Error('Failed to fetch client data')
  }
  return response.json()
}

export default function DownloadsPage() {
  const {
    data: clientData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['client-data-downloads'],
    queryFn: fetchClientData,
  })

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar descargas</CardTitle>
            <CardDescription>
              No se pudieron cargar los documentos. Por favor, intenta de nuevo.
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
          <h1 className="text-3xl font-bold tracking-tight">Descargas</h1>
          <p className="text-muted-foreground">
            Accede a todas las guías de cuidado y documentos de tus mascotas
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : clientData?.pets?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Guías de Cuidado</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : clientData?.invoices?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Facturas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Syringe className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : clientData?.pets?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Certificados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Guides Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Guías de Cuidado
          </CardTitle>
          <CardDescription>
            Guías personalizadas para el cuidado de cada una de tus mascotas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
          ) : clientData?.pets?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay guías disponibles</h3>
              <p className="text-sm text-muted-foreground text-center">
                Las guías de cuidado aparecerán aquí cuando tengas mascotas entregadas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientData?.pets?.map((pet: any) => (
                <div key={pet.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Guía de Cuidados - {pet.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Guía completa de cuidados para {pet.breed?.name} incluyendo alimentación, ejercicio, 
                      salud y bienestar específicos para la raza.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>PDF • Específico para {pet.breed?.name}</span>
                      <span>Actualizado 2024</span>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={`/api/downloads/care-guide?petId=${pet.id}`} target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facturas
          </CardTitle>
          <CardDescription>
            Todas tus facturas disponibles para descarga
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
          ) : clientData?.invoices?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay facturas disponibles</h3>
              <p className="text-sm text-muted-foreground text-center">
                Tus facturas aparecerán aquí cuando realices compras.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientData?.invoices?.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Factura {invoice.number}</h4>
                    <p className="text-sm text-muted-foreground">
                      Factura de compra - {invoice.sale?.pet?.name} • 
                      Emitida el {new Date(invoice.issuedAt).toLocaleDateString('es-CO')}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>PDF • Válida ante DIAN</span>
                      <span>Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(invoice.total)}</span>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Certificados de Vacunación
          </CardTitle>
          <CardDescription>
            Certificados oficiales del historial de vacunación
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
          ) : clientData?.pets?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Syringe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay certificados disponibles</h3>
              <p className="text-sm text-muted-foreground text-center">
                Los certificados de vacunación se generarán automáticamente cuando tus mascotas 
                completen sus esquemas de vacunación.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {clientData?.pets?.map((pet: any) => (
                <div key={pet.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Certificado de Vacunación - {pet.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Historial completo de vacunación para {pet.name} • 
                      Válido para viajes y registros veterinarios
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>PDF • Certificado oficial</span>
                      <span>Actualizado automáticamente</span>
                    </div>
                  </div>
                  <Button variant="outline" disabled>
                    <Syringe className="h-4 w-4 mr-2" />
                    Próximamente
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>¿Necesitas ayuda?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Si tienes problemas para descargar algún documento o necesitas documentos adicionales, 
            no dudes en contactarnos.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <a href="mailto:admin@dinastiacachorros.com?subject=Solicitud de documentos">
                Contactar por Email
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="tel:+573001234567">
                Llamar al +57 300 123 4567
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}