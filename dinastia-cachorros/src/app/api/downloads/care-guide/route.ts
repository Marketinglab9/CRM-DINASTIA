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
    const petId = searchParams.get('petId')

    if (!petId) {
      return NextResponse.json({ error: 'Pet ID required' }, { status: 400 })
    }

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        breed: true,
        sales: {
          include: {
            client: true
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

    // For demo purposes, return a mock care guide PDF
    // In production, this would serve breed-specific care guides
    const mockCareGuidePdf = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 120
>>
stream
BT
/F1 16 Tf
100 700 Td
(Guía de Cuidados para ${pet.breed.name}) Tj
0 -30 Td
/F1 12 Tf
(Nombre: ${pet.name}) Tj
0 -20 Td
(Raza: ${pet.breed.name}) Tj
0 -20 Td
(Color: ${pet.color}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
364
%%EOF`

    return new NextResponse(mockCareGuidePdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="guia-cuidados-${pet.name}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error serving care guide:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}