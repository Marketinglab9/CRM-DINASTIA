import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== Role.CLIENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await prisma.client.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          }
        },
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
            },
            invoice: true,
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

    // Extract pets from sales
    const pets = client.sales.map(sale => sale.pet).filter(Boolean)

    // Extract invoices from sales
    const invoices = client.sales
      .map(sale => sale.invoice)
      .filter(Boolean)
      .map(invoice => ({
        ...invoice,
        sale: client.sales.find(sale => sale.invoiceId === invoice!.id)
      }))

    const response = {
      profile: {
        ...client,
        user: client.user,
      },
      pets,
      invoices,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching client data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}