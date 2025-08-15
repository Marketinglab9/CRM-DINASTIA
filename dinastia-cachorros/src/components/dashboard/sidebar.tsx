'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BarChart3,
  ChevronDown,
  Dog,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Truck,
  Users,
  UserCheck,
  PawPrint,
  Megaphone,
} from 'lucide-react'
import { Role } from '@prisma/client'

interface SidebarProps {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Ventas',
    href: '/dashboard/sales',
    icon: FileText,
  },
  {
    title: 'Clientes',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'Cachorros',
    href: '/dashboard/pets',
    icon: Dog,
  },
  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: UserCheck,
  },
  {
    title: 'Entregas',
    href: '/dashboard/deliveries',
    icon: Truck,
  },
  {
    title: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Banners',
    href: '/dashboard/banners',
    icon: Megaphone,
    adminOnly: true,
  },
  {
    title: 'Ajustes',
    href: '/dashboard/settings',
    icon: Settings,
    adminOnly: true,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || session?.user.role === Role.ADMIN
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn(
      "flex h-full w-64 flex-col border-r bg-card text-card-foreground transition-all duration-300",
      isCollapsed && "w-16",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <PawPrint className="h-4 w-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Dinastía</span>
              <span className="text-xs text-muted-foreground">Cachorros</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 h-10",
                  isCollapsed && "px-2",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 h-12",
                isCollapsed && "px-2"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {session?.user.name ? getInitials(session.user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex flex-1 flex-col text-left">
                    <span className="text-sm font-medium">
                      {session?.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user.role === Role.ADMIN ? 'Administrador' : 'Asesor'}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <Settings className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Package className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Contraer</span>}
        </Button>
      </div>
    </div>
  )
}