import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role, VaccinationStatus } from '@prisma/client'
import { z } from 'zod'

const updateVaccinationSchema = z.object({
  status: z.enum(['DUE', 'SCHEDULED', 'DONE', 'OVERDUE']),
  completedDate: z.string().optional(),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const vaccinationId = params.id
    const body = await request.json()
    const { status, completedDate, notes } = updateVaccinationSchema.parse(body)

    // Find the vaccination
    const vaccination = await prisma.petVaccination.findUnique({
      where: { id: vaccinationId },
      include: {
        pet: {
          include: {
            sales: {
              include: {
                client: true
              }
            }
          }
        }
      }
    })

    if (!vaccination) {
      return NextResponse.json({ error: 'Vaccination not found' }, { status: 404 })
    }

    // Check ownership for clients
    if (session.user.role === Role.CLIENT) {
      const hasOwnership = vaccination.pet.sales.some(sale => 
        sale.client.userId === session.user.id && sale.status === 'DELIVERED'
      )
      
      if (!hasOwnership) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Update the vaccination
    const updatedVaccination = await prisma.petVaccination.update({
      where: { id: vaccinationId },
      data: {
        status: status as VaccinationStatus,
        completedDate: completedDate ? new Date(completedDate) : null,
        notes: notes || vaccination.notes,
      },
      include: {
        vaccine: true,
        pet: {
          include: {
            breed: true
          }
        }
      }
    })

    return NextResponse.json(updatedVaccination)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating vaccination:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}