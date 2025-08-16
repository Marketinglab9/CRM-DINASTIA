'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  RefreshCw
} from 'lucide-react'

async function fetchInvoiceDetails(invoiceId: string) {
  const response = await fetch(`/api/invoices/${invoiceId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch invoice details')
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

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.invoiceId as string

  const {
    data: invoice,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invoice-details', invoiceId],
    queryFn: () => fetchInvoiceDetails(invoiceId),
  })

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error al cargar factura</CardTitle>
            <CardDescription>
              No se pudieron cargar los detalles de la factura.
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
          <Link href="/client/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-48" /> : `Factura ${invoice?.number}`}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? <Skeleton className="h-5 w-32" /> : `Detalle completo de la factura`}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información de la Factura
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Número:</span>
                  <span className="text-sm">{invoice?.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <Badge variant="outline">Pagada</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fecha de emisión:</span>
                  <span className="text-sm">{formatDate(invoice?.issuedAt)}</span>
                </div>
                {invoice?.sentAt && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Fecha de envío:</span>
                    <span className="text-sm text-green-600">{formatDate(invoice.sentAt)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase Info */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Compra</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="space-y-3">
                {invoice?.sales?.map((sale: any) => (
                  <div key={sale.id} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium">{sale.pet?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sale.pet?.breed?.name} • {sale.pet?.sex === 'MALE' ? 'Macho' : 'Hembra'} • {sale.pet?.color}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Vendido el {formatDate(sale.saleDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Amount Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Montos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm font-medium">{formatCurrency(invoice?.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Impuestos:</span>
                <span className="text-sm font-medium">{formatCurrency(invoice?.taxes)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(invoice?.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
          <CardDescription>
            Descarga tu factura o solicita ayuda si tienes alguna pregunta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <a 
                href={`/api/invoices/${invoiceId}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="mailto:admin@dinastiacachorros.com?subject=Consulta sobre factura">
                Contactar Soporte
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Dinastía Cachorros</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Calle 123 #45-67</p>
                <p>Bogotá, Colombia</p>
                <p>+57 300 123 4567</p>
                <p>admin@dinastiacachorros.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Información Fiscal</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>NIT: 123456789-0</p>
                <p>Régimen: Simplificado</p>
                <p>Actividad: Cría y venta de mascotas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}