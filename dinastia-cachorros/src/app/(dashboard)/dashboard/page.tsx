'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  Calendar,
  Phone,
  Eye,
  Plus
} from 'lucide-react'

// Mock data for demonstration
const kpiData = {
  salesThisMonth: {
    current: 45,
    previous: 38,
    revenue: 125000000, // COP
  },
  pendingDeliveries: 12,
  activeLeads: 28,
  monthlyRevenue: 125000000, // COP
}

const recentSales = [
  {
    id: 1,
    clientName: 'Ana López',
    petName: 'Max',
    breed: 'Golden Retriever',
    amount: 2500000,
    date: '2024-12-20',
    status: 'paid',
  },
  {
    id: 2,
    clientName: 'Pedro Martínez',
    petName: 'Luna',
    breed: 'Labrador',
    amount: 2200000,
    date: '2024-12-19',
    status: 'pending',
  },
  {
    id: 3,
    clientName: 'Laura Sánchez',
    petName: 'Rocky',
    breed: 'Bulldog Francés',
    amount: 3500000,
    date: '2024-12-18',
    status: 'delivered',
  },
]

const upcomingDeliveries = [
  {
    id: 1,
    clientName: 'Jorge Ramírez',
    petName: 'Bella',
    estimatedDate: '2024-12-22',
    method: 'pickup',
    status: 'scheduled',
  },
  {
    id: 2,
    clientName: 'Carmen Díaz',
    petName: 'Coco',
    estimatedDate: '2024-12-23',
    method: 'shipping',
    status: 'pending',
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
    month: 'short',
    day: 'numeric',
  })
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    paid: { label: 'Pagado', variant: 'default' as const },
    pending: { label: 'Pendiente', variant: 'secondary' as const },
    delivered: { label: 'Entregado', variant: 'outline' as const },
    scheduled: { label: 'Programado', variant: 'default' as const },
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  )
}

export default function DashboardPage() {
  const salesGrowth = ((kpiData.salesThisMonth.current - kpiData.salesThisMonth.previous) / kpiData.salesThisMonth.previous * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de tu actividad y métricas importantes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.salesThisMonth.current}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{salesGrowth}%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entregas Pendientes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Próximas 7 días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leads Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeLeads}</div>
            <p className="text-xs text-muted-foreground">
              Requieren seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(kpiData.monthlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Diciembre 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales and Upcoming Deliveries */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
              Últimas transacciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.petName} • {sale.breed}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(sale.date)}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">
                      {formatCurrency(sale.amount)}
                    </p>
                    {getStatusBadge(sale.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Ver Todas las Ventas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Entregas</CardTitle>
            <CardDescription>
              Entregas programadas para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {delivery.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.petName}
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {formatDate(delivery.estimatedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground capitalize">
                      {delivery.method === 'pickup' ? 'Recogida' : 'Envío'}
                    </p>
                    {getStatusBadge(delivery.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Ver Todas las Entregas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}