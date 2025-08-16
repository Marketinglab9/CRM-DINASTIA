'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown,
  Shield,
  RefreshCw,
  AlertCircle 
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  isActive?: boolean
}

interface TeamLead extends User {}

interface Advisor {
  id: string
  code: string
  user: User
  teamLead: TeamLead | null
  teamLeadId: string | null
}

interface AssignmentData {
  advisors: Advisor[]
  teamLeads: TeamLead[]
}

async function fetchAssignments(): Promise<AssignmentData> {
  const response = await fetch('/api/admin/advisor-assignments')
  if (!response.ok) {
    throw new Error('Failed to fetch assignments')
  }
  return response.json()
}

async function updateAssignment(advisorId: string, teamLeadId: string | null) {
  const response = await fetch('/api/admin/advisor-assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      advisorId,
      teamLeadId,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update assignment')
  }
  
  return response.json()
}

export default function TeamAssignmentsPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    data: assignmentData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['advisor-assignments'],
    queryFn: fetchAssignments,
  })

  const assignmentMutation = useMutation({
    mutationFn: ({ advisorId, teamLeadId }: { advisorId: string, teamLeadId: string | null }) =>
      updateAssignment(advisorId, teamLeadId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['advisor-assignments'] })
      toast({
        title: 'Asignación actualizada',
        description: data.message,
      })
      setSelectedAdvisor(null)
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la asignación',
        variant: 'destructive',
      })
    },
  })

  const handleAssignment = (advisorId: string, teamLeadId: string | null) => {
    assignmentMutation.mutate({ advisorId, teamLeadId })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Error al cargar datos</CardTitle>
            <CardDescription>
              No se pudieron cargar las asignaciones. Por favor, intenta de nuevo.
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
          <h1 className="text-3xl font-bold tracking-tight">Asignaciones de Equipo</h1>
          <p className="text-muted-foreground">
            Gestiona las asignaciones de asesores a jefes de equipo
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Asesores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentData?.advisors.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Asesores activos en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asesores Asignados</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignmentData?.advisors.filter(a => a.teamLeadId).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Con jefe de equipo asignado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jefes de Equipo</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignmentData?.teamLeads.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Jefes de equipo disponibles
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Asignaciones de Asesores
          </CardTitle>
          <CardDescription>
            Asigna o desasigna asesores a jefes de equipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : assignmentData?.advisors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay asesores</h3>
              <p className="text-sm text-muted-foreground text-center">
                No se encontraron asesores en el sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignmentData?.advisors.map((advisor) => (
                <div
                  key={advisor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{advisor.user.name}</h4>
                      <Badge variant="outline">{advisor.code}</Badge>
                      {!advisor.user.isActive && (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {advisor.user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {advisor.teamLead ? (
                        <div>
                          <Badge className="mb-1">
                            <Crown className="h-3 w-3 mr-1" />
                            {advisor.teamLead.name}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {advisor.teamLead.email}
                          </p>
                        </div>
                      ) : (
                        <Badge variant="outline">
                          <UserX className="h-3 w-3 mr-1" />
                          Sin asignar
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Select
                        value={selectedAdvisor === advisor.id ? 'selecting' : advisor.teamLeadId || 'unassigned'}
                        onValueChange={(value) => {
                          if (value === 'selecting') {
                            setSelectedAdvisor(advisor.id)
                          } else if (value === 'unassigned') {
                            handleAssignment(advisor.id, null)
                          } else {
                            handleAssignment(advisor.id, value)
                          }
                        }}
                        disabled={assignmentMutation.isPending}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Seleccionar jefe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">
                            <div className="flex items-center gap-2">
                              <UserX className="h-4 w-4" />
                              Sin asignar
                            </div>
                          </SelectItem>
                          {assignmentData?.teamLeads.map((teamLead) => (
                            <SelectItem key={teamLead.id} value={teamLead.id}>
                              <div className="flex items-center gap-2">
                                <Crown className="h-4 w-4" />
                                {teamLead.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Leads Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Jefes de Equipo
          </CardTitle>
          <CardDescription>
            Vista general de jefes de equipo y sus asesores asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-48 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {assignmentData?.teamLeads.map((teamLead) => {
                const assignedAdvisors = assignmentData.advisors.filter(
                  a => a.teamLeadId === teamLead.id
                )
                
                return (
                  <div key={teamLead.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium">{teamLead.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {teamLead.email}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Asesores asignados:</span>
                        <Badge variant="outline">
                          {assignedAdvisors.length}
                        </Badge>
                      </div>
                      
                      {assignedAdvisors.length > 0 ? (
                        <div className="space-y-1">
                          {assignedAdvisors.map((advisor) => (
                            <div key={advisor.id} className="flex items-center gap-2 text-sm">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{advisor.user.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {advisor.code}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Sin asesores asignados
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}