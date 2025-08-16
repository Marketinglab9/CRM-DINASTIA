import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { z } from 'zod'

const assignmentSchema = z.object({
  advisorId: z.string().min(1, 'Advisor ID is required'),
  teamLeadId: z.string().nullable(), // null to unassign
})

// GET - Get all advisors with their team lead assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const advisors = await prisma.advisor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
          }
        },
        teamLead: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    })

    // Get all team leads for selection
    const teamLeads = await prisma.user.findMany({
      where: {
        role: Role.TEAM_LEAD,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      advisors,
      teamLeads,
    })
  } catch (error) {
    console.error('Error fetching advisor assignments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Assign or unassign advisor to team lead
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { advisorId, teamLeadId } = assignmentSchema.parse(body)

    // Verify advisor exists
    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId },
      include: {
        user: {
          select: {
            name: true,
          }
        }
      }
    })

    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 })
    }

    // If teamLeadId is provided, verify it exists and is a TEAM_LEAD
    if (teamLeadId) {
      const teamLead = await prisma.user.findUnique({
        where: { 
          id: teamLeadId,
          role: Role.TEAM_LEAD,
          isActive: true,
        }
      })

      if (!teamLead) {
        return NextResponse.json({ error: 'Team lead not found or inactive' }, { status: 404 })
      }
    }

    // Update the advisor assignment
    const updatedAdvisor = await prisma.advisor.update({
      where: { id: advisorId },
      data: { teamLeadId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        teamLead: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: teamLeadId ? 'ADVISOR_ASSIGNED' : 'ADVISOR_UNASSIGNED',
        entityType: 'Advisor',
        entityId: advisorId,
        metadata: {
          advisorName: advisor.user.name,
          teamLeadId: teamLeadId,
          teamLeadName: updatedAdvisor.teamLead?.name || null,
        }
      }
    })

    return NextResponse.json({
      success: true,
      advisor: updatedAdvisor,
      message: teamLeadId 
        ? `Asesor asignado exitosamente a ${updatedAdvisor.teamLead?.name}`
        : 'Asesor desasignado exitosamente'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error managing advisor assignment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}