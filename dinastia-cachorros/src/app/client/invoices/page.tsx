'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText,
  Download,
  Eye,
  Calendar,
  RefreshCw
} from 'lucide-react'

async function fetchMyInvoices() {
  const response = await fetch('/api/invoices?owner=me')
  if (!response.ok) {
    throw new Error('Failed to fetch invoices')
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function InvoicesPage() {
  const {
    data: invoices,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: fetchMyInvoices,
  })

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar facturas</CardTitle>
            <CardDescription>
              No se pudieron cargar las facturas. Por favor, intenta de nuevo.
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
          <h1 className="text-3xl font-bold tracking-tight">Mis Facturas</h1>
          <p className="text-muted-foreground">
            Historial completo de tus transacciones y facturas
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : invoices?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Facturas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : formatCurrency(invoices?.reduce((sum: number, inv: any) => sum + inv.total, 0) || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Pagado</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground">Disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : invoices?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-4">No tienes facturas</h3>
            <p className="text-muted-foreground text-center">
              Cuando realices compras, tus facturas aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices?.map((invoice: any) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Factura {invoice.number}
                      </h3>
                      <Badge variant="outline">Pagada</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Compra de {invoice.sale?.pet?.name} ({invoice.sale?.pet?.breed?.name})
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>Emitida: {formatDate(invoice.issuedAt)}</span>
                        </div>
                        {invoice.sentAt && (
                          <span className="text-green-600">
                            Enviada: {formatDate(invoice.sentAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-2 pt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(invoice.subtotal)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impuestos:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(invoice.taxes)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-medium text-primary">
                          {formatCurrency(invoice.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/client/invoices/${invoice.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalle
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <a 
                        href={`/api/invoices/${invoice.id}/pdf`} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información sobre Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">¿Necesitas ayuda?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Si tienes alguna pregunta sobre tus facturas o necesitas una copia adicional, 
                no dudes en contactarnos.
              </p>
              <div className="text-sm">
                <p className="font-medium">Soporte:</p>
                <p className="text-muted-foreground">admin@dinastiacachorros.com</p>
                <p className="text-muted-foreground">+57 300 123 4567</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Información Legal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Todas nuestras facturas son válidas ante la DIAN y cumplen con la 
                normativa fiscal vigente en Colombia.
              </p>
              <div className="text-sm">
                <p className="font-medium">NIT:</p>
                <p className="text-muted-foreground">123456789-0</p>
                <p className="font-medium">Régimen:</p>
                <p className="text-muted-foreground">Simplificado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}