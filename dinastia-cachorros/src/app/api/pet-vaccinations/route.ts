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

    // If client role and owner=me, get only their pets' vaccinations
    if (session.user.role === Role.CLIENT && owner === 'me') {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        include: {
          sales: {
            where: {
              status: 'DELIVERED'
            },
            include: {
              pet: {
                include: {
                  vaccinations: {
                    include: {
                      vaccine: true,
                      pet: {
                        include: {
                          breed: true
                        }
                      }
                    },
                    orderBy: {
                      scheduledDate: 'asc'
                    }
                  }
                }
              }
            }
          }
        }
      })

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
      }

      const vaccinations = client.sales
        .flatMap(sale => sale.pet.vaccinations)
        .filter(Boolean)

      return NextResponse.json(vaccinations)
    }

    // For admin/advisor users, return all vaccinations
    if (session.user.role === Role.ADMIN || session.user.role === Role.ADVISOR) {
      const vaccinations = await prisma.petVaccination.findMany({
        include: {
          vaccine: true,
          pet: {
            include: {
              breed: true
            }
          }
        },
        orderBy: {
          scheduledDate: 'asc'
        }
      })
      return NextResponse.json(vaccinations)
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching vaccinations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}