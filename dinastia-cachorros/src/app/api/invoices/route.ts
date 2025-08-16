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

    // If client role and owner=me, get only their invoices
    if (session.user.role === Role.CLIENT && owner === 'me') {
      const client = await prisma.client.findUnique({
        where: { userId: session.user.id },
        include: {
          sales: {
            include: {
              invoice: true,
              pet: {
                include: {
                  breed: true
                }
              }
            },
            where: {
              invoice: {
                isNot: null
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 })
      }

      const invoices = client.sales.map(sale => ({
        ...sale.invoice,
        sale: {
          id: sale.id,
          price: sale.price,
          saleDate: sale.saleDate,
          pet: sale.pet
        }
      })).filter(Boolean)

      return NextResponse.json(invoices)
    }

    // For admin/advisor users, return all invoices
    if (session.user.role === Role.ADMIN || session.user.role === Role.ADVISOR) {
      const invoices = await prisma.invoice.findMany({
        include: {
          sales: {
            include: {
              pet: {
                include: {
                  breed: true
                }
              },
              client: {
                include: {
                  user: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return NextResponse.json(invoices)
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}