import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const owner = searchParams.get('owner')

    // If client role and owner=me, get only their pets
    if (session.user.role === Role.CLIENT && owner === 'me') {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        include: {
          sales: {
            include: {
              pet: {
                include: {
                  breed: true,
                  vaccinations: {
                    include: {
                      vaccine: true,
                    },
                    orderBy: {
                      scheduledDate: 'asc'
                    }
                  }
                }
              }
            },
            where: {
              status: 'DELIVERED'
            }
          }
        }
      })

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
      }

      const pets = client.sales.map(sale => sale.pet).filter(Boolean)
      return NextResponse.json(pets)
    }

    // For admin/advisor users, return all pets
    if (session.user.role === Role.ADMIN || session.user.role === Role.ADVISOR) {
      const pets = await prisma.pet.findMany({
        include: {
          breed: true,
          vaccinations: {
            include: {
              vaccine: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return NextResponse.json(pets)
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching pets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}