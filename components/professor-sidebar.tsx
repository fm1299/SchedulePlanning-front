"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Calendar, BarChart3, LogOut, GraduationCap } from "lucide-react"

const professorNavItems = [
  { href: "/professor", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/professor/cursos", icon: BookOpen, label: "Cursos" },
  { href: "/professor/reserva", icon: Calendar, label: "Reservas" },
  { href: "/professor/reportes", icon: BarChart3, label: "Reportes" },
]

export function ProfessorSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
        <div className="bg-sidebar-primary p-2 rounded-lg">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground">Sistema UNSA</h1>
          <p className="text-sm text-muted-foreground">Profesor</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {professorNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-3">
          <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">Profesor</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
