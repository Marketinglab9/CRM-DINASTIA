import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const petId = params.id

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        breed: true,
        vaccinations: {
          include: {
            vaccine: true,
          },
          orderBy: {
            scheduledDate: 'asc'
          }
        },
        sales: {
          include: {
            client: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Check ownership for clients
    if (session.user.role === Role.CLIENT) {
      const hasOwnership = pet.sales.some(sale => 
        sale.client.userId === session.user.id && sale.status === 'DELIVERED'
      )
      
      if (!hasOwnership) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error('Error fetching pet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}