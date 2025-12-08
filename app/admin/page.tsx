"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, AlertTriangle, Activity } from "lucide-react"
import { mockAulas, mockReservations, mockSchedules } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const availableAulas = mockAulas.filter((aula) => aula.status === "available").length
  const totalReservations = mockReservations.length
  const conflictingSchedules = mockSchedules.filter((schedule) => {
    // Simple conflict detection logic
    return mockSchedules.some(
      (other) =>
        other.id !== schedule.id &&
        other.aulaId === schedule.aulaId &&
        other.day === schedule.day &&
        other.startTime === schedule.startTime,
    )
  }).length

  const usageData = [
    { day: "Lun", usage: 85 },
    { day: "Mar", usage: 92 },
    { day: "Mié", usage: 78 },
    { day: "Jue", usage: 88 },
    { day: "Vie", usage: 76 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Resumen general del sistema de aulas UNSA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Disponibles</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{availableAulas}</div>
            <p className="text-xs text-muted-foreground">de {mockAulas.length} aulas totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflictos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{conflictingSchedules}</div>
            <p className="text-xs text-muted-foreground">horarios en conflicto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground">últimas 24 horas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uso de Aulas por Día</CardTitle>
            <CardDescription>Porcentaje de ocupación semanal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Aulas</CardTitle>
            <CardDescription>Resumen del estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAulas.slice(0, 6).map((aula) => (
                <div key={aula.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{aula.name}</p>
                    <p className="text-sm text-muted-foreground">Capacidad: {aula.capacity}</p>
                  </div>
                  <Badge
                    variant={
                      aula.status === "available" ? "default" : aula.status === "occupied" ? "secondary" : "destructive"
                    }
                  >
                    {aula.status === "available"
                      ? "Disponible"
                      : aula.status === "occupied"
                        ? "Ocupada"
                        : "Mantenimiento"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
