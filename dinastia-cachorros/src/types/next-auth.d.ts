import NextAuth from 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      advisor?: {
        id: string
        code: string
      }
      client?: {
        id: string
        documentId?: string
        city?: string
        address?: string
      }
    }
  }

  interface User {
    role: Role
    advisor?: {
      id: string
      code: string
    }
    client?: {
      id: string
      documentId?: string
      city?: string
      address?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
    advisor?: {
      id: string
      code: string
    }
    client?: {
      id: string
      documentId?: string
      city?: string
      address?: string
    }
  }
}